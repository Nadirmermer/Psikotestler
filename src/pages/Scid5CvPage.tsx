// src/pages/Scid5CvPage.tsx (Nihai Hali)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';

import { supabase } from '@/lib/supabase';
import { scid5cv_data, ScidQuestion } from '@/features/scid/data/scid5cv.data';
import { GeneralAssessment } from '@/features/scid/components/GeneralAssessment';
import { ModuleSelector } from '@/features/scid/components/ModuleSelector';
import { ScidTestLayout } from '@/features/scid/components/ScidTestLayout';
import { QuestionRenderer } from '@/features/scid/components/QuestionRenderer';

type TestPhase = 'general_assessment' | 'module_selection' | 'questioning' | 'completed';
type AnswerPayload = { [key: string]: { answer: any; note: string } };

export const Scid5CvPage: React.FC = () => {
  const { clientId, sessionId } = useParams<{ clientId: string; sessionId: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<TestPhase>('general_assessment');
  const [questionsToAsk, setQuestionsToAsk] = useState<ScidQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload>({});
  const [sessionNote, setSessionNote] = useState('');
  const [debouncedSessionNote] = useDebounce(sessionNote, 1000);

  const handleProceedToModules = async (assessmentNotes: { [key: string]: string }) => {
    // Bu fonksiyon bir önceki adımdaki gibi notları alıp Supabase'e kaydediyor.
    const combinedNotes = Object.entries(assessmentNotes)
      .filter(([, value]) => value.trim() !== '') // Sadece dolu notları al
      .map(([key, value]) => `--- ${key} ---\n${value}`)
      .join('\n\n');

    if (combinedNotes) {
        const { error } = await supabase
          .from('scid_sessions')
          .update({ session_wide_note: combinedNotes })
          .eq('id', sessionId);

        if (error) {
          toast.error('Değerlendirme notları kaydedilirken bir hata oluştu.');
          return; // Hata durumunda ilerlemeyi durdur
        } else {
          toast.success('Genel değerlendirme notları kaydedildi.');
        }
    }
    
    setPhase('module_selection'); // Her durumda bir sonraki aşamaya geç
  };

  const handleStartQuestioning = (selectedModules: string[]) => {
    if (selectedModules.length === 0) {
      toast.error('Lütfen en az bir modül seçin.');
      return;
    }
    
    // Tüm soru verisinden, sadece seçilen modüllere ait olanları filtrele.
    // Soruların doğru sırada kalması için orijinal dizinin sırasını koruyoruz.
    const filteredQuestions = scid5cv_data.filter(q => selectedModules.includes(q.module));
    setQuestionsToAsk(filteredQuestions);
    
    toast.success(`${selectedModules.length} modül seçildi. Görüşme başlıyor.`);
    setPhase('questioning');
  };
  
  const findQuestionIndexById = useCallback((id: string) => {
    return questionsToAsk.findIndex(q => q.id === id);
  }, [questionsToAsk]);

  const handleNext = useCallback(() => {
    const question = questionsToAsk[currentQuestionIndex];
    const currentAnswer = answers[question.id]?.answer;
    
    let nextIndex = currentQuestionIndex + 1;

    // Özel Skip Logic Kontrolü (Örnek: A1 ve A2 hayır ise)
    if (question.skipLogic?.check === 'A1_A2_HAYIR' && answers['A1']?.answer === '-' && answers['A2']?.answer === '-') {
        const targetIndex = findQuestionIndexById(question.skipLogic.target);
        if (targetIndex !== -1) nextIndex = targetIndex;
    }
    // Genel Skip Logic
    else if (question.skipLogic && currentAnswer && question.skipLogic[currentAnswer]) {
        const targetIndex = findQuestionIndexById(question.skipLogic[currentAnswer]);
        if (targetIndex !== -1) nextIndex = targetIndex;
    }

    if (nextIndex >= questionsToAsk.length) {
        setPhase('completed');
    } else {
        setCurrentQuestionIndex(nextIndex);
    }
  }, [currentQuestionIndex, questionsToAsk, answers, findQuestionIndexById]);

  const handlePrev = () => {
    // TODO: Geri gitme mantığı daha karmaşık olabilir, şimdilik basit tutalım.
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const saveAnswer = async (questionId: string, payload: { answer?: any, note?: string }) => {
    if (!sessionId) return;
    const { error } = await supabase.from('scid_answers').upsert({
        session_id: sessionId,
        question_code: questionId,
        answer: payload.answer,
        question_specific_note: payload.note,
    }, { onConflict: 'session_id, question_code' });

    if(error) toast.error(`Cevap kaydedilemedi: ${questionId}`);
  };
  
  const handleAnswer = (questionId: string, answer: any) => {
    const newAnswers = { ...answers, [questionId]: { ...answers[questionId], answer }};
    setAnswers(newAnswers);
    saveAnswer(questionId, { answer });
    // Cevap verildikten sonra otomatik sonraki soruya geç
    setTimeout(handleNext, 250); // Kullanıcının seçimi görmesi için küçük bir gecikme
  };

  const handleQuestionNoteChange = (questionId: string, note: string) => {
    const newAnswers = { ...answers, [questionId]: { ...answers[questionId], note }};
    setAnswers(newAnswers);
    saveAnswer(questionId, { note });
  };
  
  // Seans genel notunu kaydetme
  useEffect(() => {
    const saveSessionNote = async () => {
        if (!sessionId || !debouncedSessionNote) return;
        await supabase.from('scid_sessions').update({ session_wide_note: debouncedSessionNote }).eq('id', sessionId);
    };
    saveSessionNote();
  }, [debouncedSessionNote, sessionId]);

  // --- ANA RENDER FONKSİYONU ---
  const currentQuestion = questionsToAsk[currentQuestionIndex];

  if (phase === 'questioning') {
    if (!currentQuestion) return <div>Yükleniyor veya test bitti...</div>;

    return (
      <ScidTestLayout
        questionArea={
          <QuestionRenderer
            question={currentQuestion}
            currentAnswer={answers[currentQuestion.id]?.answer}
            onAnswer={handleAnswer}
          />
        }
        criteriaArea={<ReactMarkdown className="text-sm">{currentQuestion.criteria || "Bu soru için belirtilmiş bir DSM-5 kriteri yoktur."}</ReactMarkdown>}
        questionNoteArea={
          <textarea
            value={answers[currentQuestion.id]?.note || ''}
            onChange={e => handleQuestionNoteChange(currentQuestion.id, e.target.value)}
            placeholder={currentQuestion.notePlaceholder || 'Bu soruya özel not ekleyin...'}
            className="w-full h-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 resize-none"
          />
        }
        sessionNote={sessionNote}
        onSessionNoteChange={setSessionNote}
        onNext={handleNext}
        onPrev={handlePrev}
        // onComplete prop'u da eklenebilir
      />
    );
  }

  // Diğer fazların render'ları (general_assessment, module_selection) önceki adımdaki gibi kalacak.
  // ...
};