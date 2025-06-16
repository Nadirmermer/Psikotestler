// src/pages/Scid5CvPage.tsx (Nihai ve Düzeltilmiş Hali)

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import { Loader2 } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { scid5cv_data, ScidQuestion } from '@/features/scid/data/scid5cv.data';
import { GeneralAssessment } from '@/features/scid/components/GeneralAssessment';
import { ModuleSelector } from '@/features/scid/components/ModuleSelector';
import { ScidTestLayout } from '@/features/scid/components/ScidTestLayout';
import { QuestionRenderer } from '@/features/scid/components/QuestionRenderer';
import { SubstanceChecklist } from '@/features/scid/components/SubstanceChecklist';
import { SubstanceQuestionnaire } from '@/features/scid/components/SubstanceQuestionnaire';
import { TraumaEventInput } from '@/features/scid/components/TraumaEventInput';
import { TraumaSelector } from '@/features/scid/components/TraumaSelector';
import { SessionReport } from '@/features/scid/components/SessionReport';

// Tipler ve sabitler
type TestPhase = 'general_assessment' | 'module_selection' | 'questioning' | 'completed';
type AnswerPayload = { [key: string]: { answer: any; note?: string } };
export interface TraumaEvent {
  description: string;
  eventType: { death_actual: boolean; death_threatened: boolean; injury_actual: boolean; injury_threatened: boolean; sexual_violence_actual: boolean; sexual_violence_threatened: boolean; };
  exposureType: 'direct' | 'witnessed' | 'learned' | 'repeated_exposure' | null;
  ageAtEvent: number | null;
}
const substanceQuestionnaireTemplate = scid5cv_data.filter(q => q.type === 'substance_questionnaire' || (q.id.includes('_GENERIC') && q.type === 'calculation'));

export const Scid5CvPage: React.FC = () => {
    // ... (tüm state tanımlamaları aynı kalacak) ...
  const { id: clientId, sessionId } = useParams<{ id: string; sessionId: string }>();
  const navigate = useNavigate();
  const noteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [phase, setPhase] = useState<TestPhase>('general_assessment');
  const [questionsToAsk, setQuestionsToAsk] = useState<ScidQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload>({});
  const [sessionNote, setSessionNote] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedSubstances, setSelectedSubstances] = useState<string[]>([]);
  const [currentSubstanceIndex, setCurrentSubstanceIndex] = useState(0);
  const [substanceQuestionnaireIndex, setSubstanceQuestionnaireIndex] = useState(0);
  const [traumaEvents, setTraumaEvents] = useState<{ [key: string]: TraumaEvent }>({});
  const [selectedTraumaForPtsd, setSelectedTraumaForPtsd] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<{ id: string, fullName: string } | null>(null);
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSessionNote] = useDebounce(sessionNote, 1000);
    // ...

    // İlk yükleme - client ve session bilgilerini al
    useEffect(() => {
      const initializePage = async () => {
        try {
          console.log('SCID sayfası başlatılıyor...', { clientId, sessionId });
          
          if (!clientId || !sessionId) {
            throw new Error('Client ID veya Session ID eksik');
          }

          // Client bilgilerini al
          const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('id, full_name')
            .eq('id', clientId)
            .single();
          
          if (clientError) {
            console.error('Client bilgisi alınamadı:', clientError);
            throw new Error('Danışan bilgisi bulunamadı');
          }

          // Session bilgilerini al
          const { data: session, error: sessionError } = await supabase
            .from('scid_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();
          
          if (sessionError) {
            console.error('Session bilgisi alınamadı:', sessionError);
            throw new Error('Test oturumu bulunamadı');
          }

          console.log('Veri yüklendi:', { client, session });
          
          setClientInfo({ id: client.id, fullName: client.full_name });
          setSessionNote(session.session_wide_note || '');
          setSessionDate(session.updated_at);
          
          // Önceki cevapları al
          const { data: savedAnswers, error: answersError } = await supabase
            .from('scid_answers')
            .select('*')
            .eq('session_id', sessionId);
          
          if (!answersError && savedAnswers) {
            const answerMap: AnswerPayload = {};
            savedAnswers.forEach(ans => {
              answerMap[ans.question_code] = {
                answer: ans.answer,
                note: ans.question_specific_note
              };
            });
            setAnswers(answerMap);
          }

          setLoading(false);
        } catch (err) {
          console.error('Sayfa başlatma hatası:', err);
          setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu');
          setLoading(false);
        }
      };

      initializePage();
    }, [clientId, sessionId]);

    // --- Veritabanı Fonksiyonları ---
    const saveAnswer = useCallback(async (questionId: string, payload: { answer?: any; note?: string }) => {
      if (!sessionId) return;
      
      try {
        const { error } = await supabase
          .from('scid_answers')
          .upsert({
            session_id: sessionId,
            question_code: questionId,
            answer: payload.answer?.toString(),
            question_specific_note: payload.note || null
          }, {
            onConflict: 'session_id,question_code'
          });
        
        if (error) {
          console.error('Cevap kaydetme hatası:', error);
          toast.error('Cevap kaydedilemedi');
        }
      } catch (err) {
        console.error('Kaydetme hatası:', err);
      }
    }, [sessionId]);

    const saveTraumaEventsToDb = useCallback(async (events: { [key: string]: TraumaEvent }) => {
      if (!sessionId) return;
      
      try {
        const { error } = await supabase
          .from('scid_sessions')
          .update({ trauma_events: events })
          .eq('id', sessionId);
        
        if (error) {
          console.error('Travma kaydetme hatası:', error);
          toast.error('Travma olayları kaydedilemedi.');
        }
      } catch (err) {
        console.error('Travma kaydetme hatası:', err);
      }
    }, [sessionId]);

    // Seans notunu kaydet
    useEffect(() => {
      const saveSessionNote = async () => {
        if (!sessionId || !debouncedSessionNote) return;
        
        try {
          const { error } = await supabase
            .from('scid_sessions')
            .update({ session_wide_note: debouncedSessionNote })
            .eq('id', sessionId);
          
          if (error) {
            console.error('Seans notu kaydetme hatası:', error);
          }
        } catch (err) {
          console.error('Seans notu kaydetme hatası:', err);
        }
      };

      saveSessionNote();
    }, [debouncedSessionNote, sessionId]);

    // --- Akış ve Navigasyon Fonksiyonları ---
    const findQuestionIndexById = useCallback((id: string) => questionsToAsk.findIndex(q => q.id === id), [questionsToAsk]);

    const handleProceedToModules = useCallback(() => {
      console.log('Genel değerlendirmeden modül seçimine geçiliyor...');
      setPhase('module_selection');
    }, []);

    const handleStartQuestioning = useCallback((selectedModules: string[]) => {
      console.log('Seçilen modüller:', selectedModules);
      console.log('Toplam soru sayısı (scid5cv_data):', scid5cv_data.length);
      
      // Seçilen modüllere göre soruları filtrele
      // Genel değerlendirme sorularını dahil etme, sadece seçilen modüllerdeki soruları al
      const filteredQuestions = scid5cv_data.filter(q => {
        const questionModule = q.module;
        // Genel değerlendirme sorularını hariç tut
        if (questionModule === 'Genel') {
          return false;
        }
        const isIncluded = selectedModules.includes(questionModule || '');
        
        if (isIncluded) {
          console.log(`Soru dahil edildi: ${q.id} (Modül: ${questionModule})`);
        }
        
        return isIncluded;
      });
      
      console.log('Filtrelenmiş soru sayısı:', filteredQuestions.length);
      console.log('İlk 5 soru:', filteredQuestions.slice(0, 5).map(q => ({ id: q.id, module: q.module, text: q.text?.substring(0, 50) })));
      
      if (filteredQuestions.length === 0) {
        console.error('Hiç soru bulunamadı! Seçilen modüller:', selectedModules);
        toast.error('Seçilen modüller için soru bulunamadı!');
        return;
      }
      
      setQuestionsToAsk(filteredQuestions);
      setCurrentQuestionIndex(0);
      setPhase('questioning');
      
      console.log('Questioning phase\'e geçildi. İlk soru:', filteredQuestions[0]);
    }, []);

    const handleNext = useCallback((calculatedResult?: string) => {
      const question = questionsToAsk[currentQuestionIndex];
      if (!question) {
        setPhase('completed');
        return;
      }

      // Son soru mu kontrol et
      if (currentQuestionIndex >= questionsToAsk.length - 1) {
        setPhase('completed');
        return;
      }

      let skipTargetId: string | null = null;

      // Skip logic kontrolü
      if (question.skipLogic && Array.isArray(question.skipLogic)) {
        const currentAnswer = answers[question.id]?.answer || calculatedResult;
        
        for (const rule of question.skipLogic) {
          if (rule.condition === currentAnswer) {
            skipTargetId = rule.skipTo;
            break;
          }
        }
      }

      // Hedef soruya atla veya bir sonraki soruya geç
      if (skipTargetId) {
        const targetIndex = findQuestionIndexById(skipTargetId);
        if (targetIndex !== -1) {
          setCurrentQuestionIndex(targetIndex);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, [questionsToAsk, currentQuestionIndex, answers, findQuestionIndexById]);

    const handleAnswer = useCallback((questionId: string, answer: any) => {
      const newAnswers = {
        ...answers,
        [questionId]: { ...answers[questionId], answer }
      };
      setAnswers(newAnswers);
      saveAnswer(questionId, { answer });
      
      // Seçenekli sorularda otomatik olarak sonraki soruya geç
      const currentQuestion = questionsToAsk.find(q => q.id === questionId);
      if (currentQuestion?.options && currentQuestion.options.length > 0) {
        setTimeout(() => {
          handleNext();
        }, 500);
      }
    }, [answers, saveAnswer, questionsToAsk, handleNext]);

    const handleQuestionNoteChange = useCallback((questionId: string, note: string) => {
      const newAnswers = {
        ...answers,
        [questionId]: { ...answers[questionId], note }
      };
      setAnswers(newAnswers);
      
      // Debounce ile kaydetme - çok sık kaydetmeyi önle
      if (noteTimeoutRef.current) {
        clearTimeout(noteTimeoutRef.current);
      }
      noteTimeoutRef.current = setTimeout(() => {
        saveAnswer(questionId, { note });
      }, 1000);
    }, [answers, saveAnswer]);

    // Hesaplama useEffect'i
    useEffect(() => {
      const performCalculation = async (question: ScidQuestion) => {
        if (!question.calculation) return;

        setIsCalculating(true);

        try {
          const { sources, condition, threshold, contextSourceId } = question.calculation;
          let result = 'HAYIR';

          switch (condition) {
            case 'count_positive':
              const positiveCount = sources.filter(id => answers[id]?.answer === '+').length;
              result = (threshold && positiveCount >= threshold) ? 'EVET' : 'HAYIR';
              break;

            case 'any_positive':
              result = sources.some(id => answers[id]?.answer === '+') ? 'EVET' : 'HAYIR'; 
              break;

            case 'count_positive_mania':
              const maniaCount = sources.filter(id => answers[id]?.answer === '+').length;
              if (contextSourceId && answers[contextSourceId]?.answer === '+') {
                result = (threshold && maniaCount >= threshold) ? 'EVET' : 'HAYIR';
              } else {
                result = (threshold && maniaCount >= (threshold + 1)) ? 'EVET' : 'HAYIR';
              }
              break;

            default:
              result = 'HAYIR';
          }

          console.log('Hesaplama sonucu:', { questionId: question.id, result, sources, condition });

          // Sonucu kaydet
          handleAnswer(question.id, result);
          
          // Bir sonraki soruya geç
          setTimeout(() => {
            setIsCalculating(false);
            handleNext(result);
          }, 1000);

        } catch (err) {
          console.error('Hesaplama hatası:', err);
          setIsCalculating(false);
          toast.error('Hesaplama sırasında hata oluştu');
        }
      };

      const currentQuestion = questionsToAsk[currentQuestionIndex];
      if (currentQuestion?.type === 'calculation' && !answers[currentQuestion.id]) {
        performCalculation(currentQuestion);
      }
    }, [currentQuestionIndex, questionsToAsk, answers, handleAnswer, handleNext]);

    // --- ANA RENDER FONKSİYONU ---
    const renderContent = () => {
      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="text-white text-lg">SCID-5-CV yükleniyor...</p>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Hata Oluştu</h1>
            <p className="text-lg mb-4">{error}</p>
            <button 
              onClick={() => navigate('/clients')}
              className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Danışanlar Sayfasına Dön
            </button>
          </div>
        );
      }

      if (phase === 'general_assessment') {
        return <GeneralAssessment onProceed={handleProceedToModules} />;
      }

      if (phase === 'module_selection') {
        return <ModuleSelector onStart={handleStartQuestioning} />;
      }

      if (phase === 'completed') {
        return (
          <SessionReport
            answers={answers}
            allQuestions={questionsToAsk}
            sessionNote={sessionNote}
            clientName={clientInfo?.fullName || 'Bilinmeyen'}
            sessionDate={sessionDate}
          />
        );
      }

      if (phase === 'questioning') {
        const question = questionsToAsk[currentQuestionIndex];
        
        if (!question) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
              <p className="text-lg">Test tamamlandı veya soru bulunamadı.</p>
              <button 
                onClick={() => setPhase('completed')}
                className="mt-4 px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
              >
                Raporu Görüntüle
              </button>
            </div>
          );
        }
        
        if (isCalculating) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Hesaplanıyor...</p>
            </div>
          );
        }

        // Özel soru tipleri
        switch (question.type) {
          case 'trauma_event_input':
            return (
              <TraumaEventInput
                questionText={question.text}
                initialData={traumaEvents[question.id] || null}
                onProceed={(data) => {
                  const newEvents = { ...traumaEvents, [question.id]: data };
                  setTraumaEvents(newEvents);
                  saveTraumaEventsToDb(newEvents);
                  handleNext();
                }}
              />
            );
          
          case 'instruction':
            if (question.id === 'G13') {
              const validEvents = Object.values(traumaEvents).filter(e => e && e.description);
              if (validEvents.length === 0) {
                const nextModuleIndex = findQuestionIndexById('H1');
                if (nextModuleIndex !== -1) setCurrentQuestionIndex(nextModuleIndex);
                return null;
              }
              return (
                <TraumaSelector
                  traumaEvents={traumaEvents}
                  onSelect={(eventId) => {
                    setSelectedTraumaForPtsd(eventId);
                    toast.success(`${eventId} ID'li olay seçildi.`);
                    handleNext();
                  }}
                  onSkip={() => {
                    const nextModuleIndex = findQuestionIndexById('H1');
                    if (nextModuleIndex !== -1) setCurrentQuestionIndex(nextModuleIndex);
                  }}
                />
              );
            }
            break;

          case 'substance_checklist':
            if (question.substance_list) {
              return (
                <SubstanceChecklist
                  questionText={question.text}
                  substances={question.substance_list}
                  onComplete={(selected) => {
                    setSelectedSubstances(selected);
                    handleAnswer(question.id, selected);
                    handleNext();
                  }}
                />
              );
            }
            break;
          
          case 'substance_questionnaire':
            // Madde sorgu mantığı burada implement edilir
            break;
        }

                 // Varsayılan ScidTestLayout
         return (
           <ScidTestLayout
             questionArea={
               <QuestionRenderer
                 question={question}
                 currentAnswer={answers[question.id]?.answer}
                 onAnswer={handleAnswer}
                 onNext={() => handleNext()}
               />
             }
             criteriaArea={
               <div className="prose prose-sm dark:prose-invert max-w-none">
                 {question.criteria || 'Bu soru için kriter bilgisi bulunmuyor.'}
               </div>
             }
             questionNoteArea={
               <textarea
                 value={answers[question.id]?.note || ''}
                 onChange={(e) => handleQuestionNoteChange(question.id, e.target.value)}
                 placeholder={question.notePlaceholder || 'Bu soruya özel notlarınızı buraya yazın...'}
                 className="w-full p-2 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-white dark:bg-yellow-900/10 resize-none text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                 rows={2}
               />
             }
             sessionNoteArea={<></>}
             sessionNote={sessionNote}
             onSessionNoteChange={setSessionNote}
             currentQuestionIndex={currentQuestionIndex}
             totalQuestions={questionsToAsk.length}
             clientName={clientInfo?.fullName || 'Danışan'}
             currentModule={question.module || 'Genel'}
           />
         );
      }

      return null;
    };

    return renderContent();
};