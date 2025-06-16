// src/pages/Scid5CvPage.tsx (Nihai Hali)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { moduleE_data } from '@/features/scid/data/module-e.data';
import { SubstanceQuestionnaire } from '@/features/scid/components/SubstanceQuestionnaire';
import { TraumaEventInput } from '@/features/scid/components/TraumaEventInput';
import { TraumaSelector } from '@/features/scid/components/TraumaSelector';
import { SessionReport } from '@/features/scid/components/SessionReport';

type TestPhase = 'general_assessment' | 'module_selection' | 'questioning' | 'completed';
type AnswerPayload = { [key: string]: { answer: any; note: string } };

// Şablon sorularımızı alalım
const substanceQuestionnaireTemplate = moduleE_data.filter(q => q.type === 'substance_questionnaire' || (q.id.includes('_GENERIC') && q.type === 'calculation'));

export interface TraumaEvent {
  description: string;
  eventType: {
    death_actual: boolean;
    death_threatened: boolean;
    injury_actual: boolean;
    injury_threatened: boolean;
    sexual_violence_actual: boolean;
    sexual_violence_threatened: boolean;
  };
  exposureType: 'direct' | 'witnessed' | 'learned' | 'repeated_exposure' | null;
  ageAtEvent: number | null;
}


export const Scid5CvPage: React.FC = () => {
  const { clientId, sessionId } = useParams<{ clientId: string; sessionId: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<TestPhase>('general_assessment');
  const [questionsToAsk, setQuestionsToAsk] = useState<ScidQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload>({});
  const [sessionNote, setSessionNote] = useState('');
  const [debouncedSessionNote] = useDebounce(sessionNote, 1000);
  const [isCalculating, setIsCalculating] = useState(false);

  // Module E için yeni state'ler
  const [selectedSubstances, setSelectedSubstances] = useState<string[]>([]);
  const [currentSubstanceIndex, setCurrentSubstanceIndex] = useState(0);
  const [substanceQuestionnaireIndex, setSubstanceQuestionnaireIndex] = useState(0);

  // ÖSGB için yeni state'ler
  const [traumaEvents, setTraumaEvents] = useState<{ [key: string]: TraumaEvent }>({});
  const [selectedTraumaForPtsd, setSelectedTraumaForPtsd] = useState<string | null>(null);

  const [clientInfo, setClientInfo] = useState<{ id: string, fullName: string } | null>(null);
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState(true);

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

  const handleSubstanceSelectionComplete = (substances: string[]) => {
    if (substances.length === 0) {
      // Hiç madde seçilmediyse bir sonraki modüle atla
      const nextModuleIndex = findQuestionIndexById('F1'); // Modül F'nin başlangıcı
      if (nextModuleIndex !== -1) setCurrentQuestionIndex(nextModuleIndex);
      else setPhase('completed');
      return;
    }
    setSelectedSubstances(substances);
    setPhase('questioning'); // Soru sorma fazına geri dön
    // Döngünün ilk maddesi için soru indeksini ayarla
    const firstSubstanceQuestionIndex = findQuestionIndexById('E23_GENERIC');
    setCurrentQuestionIndex(firstSubstanceQuestionIndex);
  };

  // Mevcut soruyu belirleme mantığı artık daha karmaşık
  const currentQuestion = useMemo(() => {
    const baseQuestion = questionsToAsk[currentQuestionIndex];
    if (baseQuestion?.type === 'substance_questionnaire' || baseQuestion?.id.includes('_GENERIC')) {
      const currentSubstanceId = selectedSubstances[currentSubstanceIndex];
      const substanceInfo = moduleE_data.find(q => q.type === 'substance_checklist')?.substance_list?.find(s => s.id === currentSubstanceId);
      
      if(!baseQuestion || !substanceInfo) return baseQuestion;

      // Şablon soruyu alıp, mevcut maddeye göre dinamik olarak güncelleyelim
      return {
        ...baseQuestion,
        id: `${baseQuestion.id}_${currentSubstanceId}`, // Cevabı kaydetmek için dinamik ID
        text: baseQuestion.text.replace(/\(MADDE\)/g, substanceInfo.name), // Metindeki (MADDE) yi değiştir
        notePlaceholder: `Tanı ve ciddiyet düzeyi (${substanceInfo.name})...`
      };
    }
    return baseQuestion;
  }, [currentQuestionIndex, questionsToAsk, selectedSubstances, currentSubstanceIndex]);

  const handleNext = useCallback((calculatedResult?: string) => {
    const question = questionsToAsk[currentQuestionIndex];
    
    // Eğer mevcut soru SCID'in sonu ise, fazı 'completed' yap
    if (question?.id === 'SCID_END' || currentQuestionIndex >= questionsToAsk.length - 1) {
      setPhase('completed');
      return;
    }

    // Madde anketi döngüsü içindeysek...
    if (question?.id.includes('_GENERIC')) {
      const nextSubstanceQuestionIndex = substanceQuestionnaireIndex + 1;
  
      // Mevcut madde için anket bitti mi?
      if (nextSubstanceQuestionIndex >= substanceQuestionnaireTemplate.length) {
        const nextSubstanceIndex = currentSubstanceIndex + 1;
  
        // Tüm seçili maddeler bitti mi?
        if (nextSubstanceIndex >= selectedSubstances.length) {
          const nextModuleIndex = findQuestionIndexById('F1');
          setCurrentQuestionIndex(nextModuleIndex);
        } else {
          // Sonraki maddeye geç, anket indeksini sıfırla
          setCurrentSubstanceIndex(nextSubstanceIndex);
          setSubstanceQuestionnaireIndex(0);
          // Ana soru indeksi aynı kalır (E23_GENERIC'te)
        }
      } else {
        // Aynı madde için sonraki soruya geç
        setSubstanceQuestionIndex(nextSubstanceQuestionIndex);
      }
    } else {
      // Normal ilerleme mantığı
      setCurrentQuestionIndex(prev => prev + 1);
    }

    // Otomatik hesaplama
    if (question?.type === 'calculation' && question.calculation) {
      setIsCalculating(true);
      
      const { sources, condition } = question.calculation;
      let calculatedValue: 'EVET' | 'HAYIR' | string = 'HAYIR'; // Sonuç artık string de olabilir

      if (condition === 'any_positive') {
        const isAnyPositive = sources.some(sourceId => answers[sourceId]?.answer === '+');
        if (isAnyPositive) calculatedValue = 'EVET';
      }
      
      else if (condition === 'count_positive') {
        const threshold = question.calculation.threshold || 0;
        let count = 0;
        sources.forEach(sourceId => {
          if (answers[sourceId]?.answer === '+') count++;
        });
        if (count >= threshold) calculatedValue = 'EVET';
      }
      
      else if (condition === 'count_positive_mania') {
        const contextId = question.calculation.contextSourceId;
        const moodAnswer = contextId ? answers[contextId]?.answer : null;
        
        // Eğer duygudurum "sadece sinirli" ise eşik 4, diğer durumlarda 3'tür.
        const threshold = (moodAnswer === 'irritable') ? 4 : 3;

        let count = 0;
        sources.forEach(sourceId => {
          if (answers[sourceId]?.answer === '+') count++;
        });

        if (count >= threshold) calculatedValue = 'EVET';
      }

      else if (condition === 'schizophrenia_A') {
        const coreSymptoms = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20'];
        const allSymptoms = sources;

        const positiveSymptoms = allSymptoms.filter(id => answers[id]?.answer === '+');
        const hasCoreSymptom = positiveSymptoms.some(id => coreSymptoms.includes(id));
        
        if (positiveSymptoms.length >= 2 && hasCoreSymptom) {
          calculatedValue = 'EVET';
        }
      }
      
      else if (condition === 'bipolar_II_check') {
        const hipoManiSources = ['A53', 'A77'];
        const depSources = ['A12', 'A26'];

        const hasHipomania = hipoManiSources.some(id => answers[id]?.answer === '+');
        const hasDepression = depSources.some(id => answers[id]?.answer === '+');

        if (hasHipomania && hasDepression) {
          calculatedValue = 'EVET';
        }
      }
      
      // YENİ CİDDİYET HESAPLAMA KOŞULU
      else if (condition === 'count_positive_severity') {
        const count = sources.reduce((acc, sourceId) => {
          return answers[sourceId]?.answer === '+' ? acc + 1 : acc;
        }, 0);

        if (count >= 6) calculatedValue = 'Ağır';
        else if (count >= 4) calculatedValue = 'Orta';
        else if (count >= 2) calculatedValue = 'Ağır Olmayan';
        else calculatedValue = 'Tanı Yok';
      }
      
      setTimeout(() => {
        setIsCalculating(false);
        // handleNext artık string sonuçları da işleyebilmeli
        handleNext(calculatedValue as any); 
      }, 2000);
    }
  }, [currentQuestionIndex, questionsToAsk, selectedSubstances, currentSubstanceIndex, substanceQuestionnaireIndex]);

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

  // OTOMATİK HESAPLAMA MANTIĞI
  useEffect(() => {
    if (currentQuestion?.type === 'calculation' && currentQuestion.calculation) {
        setIsCalculating(true);
        
        const { sources, condition } = currentQuestion.calculation;
        let calculatedValue: 'EVET' | 'HAYIR' | string = 'HAYIR'; // Sonuç artık string de olabilir

        if (condition === 'any_positive') {
            const isAnyPositive = sources.some(sourceId => answers[sourceId]?.answer === '+');
            if (isAnyPositive) calculatedValue = 'EVET';
        }
        
        else if (condition === 'count_positive') {
            const threshold = currentQuestion.calculation.threshold || 0;
            let count = 0;
            sources.forEach(sourceId => {
                if (answers[sourceId]?.answer === '+') count++;
            });
            if (count >= threshold) calculatedValue = 'EVET';
        }
        
        else if (condition === 'count_positive_mania') {
            const contextId = currentQuestion.calculation.contextSourceId;
            const moodAnswer = contextId ? answers[contextId]?.answer : null;
            
            // Eğer duygudurum "sadece sinirli" ise eşik 4, diğer durumlarda 3'tür.
            const threshold = (moodAnswer === 'irritable') ? 4 : 3;

            let count = 0;
            sources.forEach(sourceId => {
                if (answers[sourceId]?.answer === '+') count++;
            });

            if (count >= threshold) calculatedValue = 'EVET';
        }

        else if (condition === 'schizophrenia_A') {
            const coreSymptoms = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20'];
            const allSymptoms = sources;

            const positiveSymptoms = allSymptoms.filter(id => answers[id]?.answer === '+');
            const hasCoreSymptom = positiveSymptoms.some(id => coreSymptoms.includes(id));
            
            if (positiveSymptoms.length >= 2 && hasCoreSymptom) {
                calculatedValue = 'EVET';
            }
        }
        
        else if (condition === 'bipolar_II_check') {
            const hipoManiSources = ['A53', 'A77'];
            const depSources = ['A12', 'A26'];

            const hasHipomania = hipoManiSources.some(id => answers[id]?.answer === '+');
            const hasDepression = depSources.some(id => answers[id]?.answer === '+');

            if (hasHipomania && hasDepression) {
                calculatedValue = 'EVET';
            }
        }
        
        // YENİ CİDDİYET HESAPLAMA KOŞULU
        else if (condition === 'count_positive_severity') {
            const count = sources.reduce((acc, sourceId) => {
                return answers[sourceId]?.answer === '+' ? acc + 1 : acc;
            }, 0);

            if (count >= 6) calculatedValue = 'Ağır';
            else if (count >= 4) calculatedValue = 'Orta';
            else if (count >= 2) calculatedValue = 'Ağır Olmayan';
            else calculatedValue = 'Tanı Yok';
        }
        
        setTimeout(() => {
            setIsCalculating(false);
            // handleNext artık string sonuçları da işleyebilmeli
            handleNext(calculatedValue as any); 
        }, 2000);
    }
  }, [currentQuestion, answers, handleNext]);

  // Sayfa yüklendiğinde danışan ve seans bilgilerini çek
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!clientId || !sessionId) return;
      setLoading(true);
      
      const clientPromise = supabase.from('clients').select('id, full_name').eq('id', clientId).single();
      const sessionPromise = supabase.from('scid_sessions').select('created_at, session_wide_note').eq('id', sessionId).single();

      const [clientResult, sessionResult] = await Promise.all([clientPromise, sessionPromise]);

      if (clientResult.error || !clientResult.data) {
        toast.error("Danışan bilgileri yüklenemedi.");
        navigate('/clients');
      } else {
        setClientInfo({ id: clientResult.data.id, fullName: clientResult.data.full_name });
      }

      if (sessionResult.data) {
        setSessionDate(sessionResult.data.created_at);
        setSessionNote(sessionResult.data.session_wide_note || '');
      }

      // TODO: Mevcut cevapları da yükle

      setLoading(false);
    };
    fetchInitialData();
  }, [clientId, sessionId, navigate]);

  // --- ANA RENDER FONKSİYONU ---

  const renderQuestion = (question: ScidQuestion) => {
    if (isCalculating) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-xl font-semibold">Sonuçlar Hesaplanıyor...</p>
                <p className="text-gray-500">{question.text}</p>
            </div>
        );
    }
    return (
      <QuestionRenderer
        question={question}
        currentAnswer={answers[question.id]?.answer}
        onAnswer={handleAnswer}
      />
    );
  };

  const renderContent = () => {
    if (loading) return <div>Yükleniyor...</div>;
    
    if (phase === 'completed') {
      return (
        <SessionReport
          answers={answers}
          allQuestions={questionsToAsk}
          sessionNote={sessionNote}
          clientName={clientInfo?.fullName || 'Bilinmiyor'}
          sessionDate={sessionDate}
        />
      );
    }

    if (phase === 'questioning') {
        if (!currentQuestion) return <div>Test tamamlandı veya bir hata oluştu.</div>;

        // E14 sorusuna gelindiğinde madde listesini göster
        if (currentQuestion.id === 'E14' && currentQuestion.type === 'substance_checklist') {
            return (
                <SubstanceChecklist
                    questionText={currentQuestion.text}
                    substances={currentQuestion.substance_list || []}
                    onComplete={handleSubstanceSelectionComplete}
                />
            );
        }
        
        // E23 (veya benzeri) anket sorusuna gelindiğinde yeni anket bileşenini göster
        if (currentQuestion.id.includes('_GENERIC') && currentQuestion.type === 'substance_questionnaire') {
            const currentSubstanceId = selectedSubstances[currentSubstanceIndex];
            const substanceInfo = moduleE_data.find(q => q.type === 'substance_checklist')?.substance_list?.find(s => s.id === currentSubstanceId);
            
            return (
                <SubstanceQuestionnaire
                    questionnaire={currentQuestion}
                    substanceName={substanceInfo?.name || 'Bilinmeyen Madde'}
                    onComplete={(subAnswers) => {
                        // Gelen anket cevaplarını ana cevap listesine ekle
                        const formattedAnswers = {};
                        for (const key in subAnswers) {
                            formattedAnswers[`${key}_${currentSubstanceId}`] = { answer: subAnswers[key] };
                        }
                        setAnswers(prev => ({...prev, ...formattedAnswers}));
                        handleNext(); // Anketi tamamlayınca bir sonraki adıma geç
                    }}
                />
            )
        }
        
        // G10, G11, G12 için yeni render mantığı
        if (currentQuestion.type === 'trauma_event_input') {
            return (
                <TraumaEventInput
                    questionText={currentQuestion.text}
                    initialData={traumaEvents[currentQuestion.id] || null}
                    onProceed={(data) => {
                        // Veriyi state'e kaydet
                        const newEvents = { ...traumaEvents, [currentQuestion.id]: data };
                        setTraumaEvents(newEvents);
                        
                        // TODO: Veritabanına kaydetme işlemi burada yapılabilir.
                        // Örn: saveTraumaEventToDb(sessionId, currentQuestion.id, data);
                        
                        handleNext();
                    }}
                />
            );
        }

        // G13 için yeni render mantığı
        if (currentQuestion.id === 'G13') {
            return (
                <TraumaSelector
                    traumaEvents={traumaEvents}
                    onSelect={(eventId) => {
                        setSelectedTraumaForPtsd(eventId);
                        
                        // TODO: Seçilen travmayı veritabanına not et
                        toast.success(`${eventId} ID'li olay PTSD değerlendirmesi için seçildi.`);

                        handleNext();
                    }}
                />
            );
        }
        
        // Diğer tüm normal sorular için ana test arayüzü
        return (
            <ScidTestLayout
                questionArea={renderQuestion(currentQuestion)}
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
            />
        );
    }

    // Diğer fazların render'ları (general_assessment, module_selection) önceki adımdaki gibi kalacak.
    // ...

    return renderContent();
  };

  return renderContent();
};