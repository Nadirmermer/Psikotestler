// src/pages/Scid5CvPage.tsx (Nihai ve Düzeltilmiş Hali)

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
  const { clientId, sessionId } = useParams<{ clientId: string; sessionId: string }>();
  const navigate = useNavigate();
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
  const [debouncedSessionNote] = useDebounce(sessionNote, 1000);
    // ...

    // --- Veritabanı Fonksiyonları ---
    const saveAnswer = useCallback(async (questionId: string, payload: { answer?: any; note?: string }) => {
        // ... (saveAnswer fonksiyonu aynı kalır) ...
    }, [sessionId]);

    const saveTraumaEventsToDb = useCallback(async (events: { [key: string]: TraumaEvent }) => {
        if (!sessionId) return;
        const { error } = await supabase.from('scid_sessions').update({ trauma_events: events }).eq('id', sessionId);
        if (error) toast.error('Travma olayları kaydedilemedi.');
    }, [sessionId]);

    useEffect(() => {
        // ... (Seans genel notunu kaydeden useEffect aynı kalır) ...
    }, [debouncedSessionNote, sessionId]);

    // --- Akış ve Navigasyon Fonksiyonları ---
    const findQuestionIndexById = useCallback((id: string) => questionsToAsk.findIndex(q => q.id === id), [questionsToAsk]);

    const handleNext = useCallback((calculatedResult?: string) => {
        const question = questionsToAsk[currentQuestionIndex];
        if (!question) {
            setPhase('completed');
            return;
        }

        if (question.id === 'SCID_END' || currentQuestionIndex >= questionsToAsk.length - 1) {
            setPhase('completed');
            return;
        }

        let skipTargetId: string | null = null;
        const currentAnswer = calculatedResult ?? answers[question.id]?.answer;

        if (question.skipLogic) {
            if (question.skipLogic.check && answers) {
                // ... (Özel skip logic kontrolleri, örn: A1_A2_HAYIR)
            } else if (currentAnswer && question.skipLogic[currentAnswer]) {
                skipTargetId = question.skipLogic[currentAnswer];
            } else if (question.skipLogic['*']) { // Her durumda atla
                skipTargetId = question.skipLogic['*'];
            }
        }

        if (skipTargetId) {
            const nextIndex = findQuestionIndexById(skipTargetId);
            setCurrentQuestionIndex(nextIndex !== -1 ? nextIndex : currentQuestionIndex + 1);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, questionsToAsk, answers, findQuestionIndexById]);

    // ... (handlePrev, handleAnswer, handleQuestionNoteChange, handleProceedToModules, handleStartQuestioning, handleSubstanceSelectionComplete aynı kalır) ...

    // ... (useEffect for calculation aynı kalır) ...

    // --- ANA RENDER FONKSİYONU ---
    const renderContent = () => {
        // ... (loading, general_assessment, module_selection fazları aynı) ...

        if (phase === 'questioning') {
            const question = questionsToAsk[currentQuestionIndex];
            if (!question) return <div>Yükleniyor veya test bitti...</div>;
            
            if (isCalculating) return <div className="flex flex-col items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin" /><p>Hesaplanıyor...</p></div>;

            switch (question.type) {
                case 'trauma_event_input':
                    return <TraumaEventInput
                        questionText={question.text}
                        initialData={traumaEvents[question.id] || null}
                        onProceed={(data) => {
                            const newEvents = { ...traumaEvents, [question.id]: data };
                            setTraumaEvents(newEvents);
                            saveTraumaEventsToDb(newEvents);
                            handleNext();
                        }}
                    />;
                
                case 'instruction':
                    // G13, travma seçimi için bir talimattır
                    if (question.id === 'G13') {
                        const validEvents = Object.values(traumaEvents).filter(e => e && e.description);
                        if(validEvents.length === 0) {
                            // Hiç travma girilmediyse PTSD bölümünü atla
                            const nextModuleIndex = findQuestionIndexById('H1');
                            if(nextModuleIndex !== -1) setCurrentQuestionIndex(nextModuleIndex);
                            return null;
                        }
                        return <TraumaSelector
                            traumaEvents={traumaEvents}
                            onSelect={(eventId) => {
                                setSelectedTraumaForPtsd(eventId);
                                toast.success(`${eventId} ID'li olay seçildi.`);
                                handleNext();
                            }}
                            onSkip={() => {
                                const nextModuleIndex = findQuestionIndexById('H1');
                                if(nextModuleIndex !== -1) setCurrentQuestionIndex(nextModuleIndex);
                            }}
                        />;
                    }
                    // Diğer talimatlar ScidTestLayout içinde gösterilir
                    break; // break to fall through to default ScidTestLayout rendering

                case 'substance_checklist':
                    // ... (SubstanceChecklist render mantığı)
                    break;
                
                case 'substance_questionnaire':
                    // ... (SubstanceQuestionnaire render mantığı)
                    break;
            }

            // Varsayılan olarak tüm 'question', 'instruction', 'summary' tipleri için
            return (
                <ScidTestLayout
                    // ... (prop'lar aynı)
                />
            );
        }
    };

    return renderContent();
};