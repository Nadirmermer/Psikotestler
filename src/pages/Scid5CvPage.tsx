import React, { useState, useEffect, useCallback, useRef } from 'react';
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
type TestPhase = 'loading' | 'general_assessment' | 'module_selection' | 'questioning' | 'completed';
type AnswerPayload = { [key: string]: { answer: any; note?: string } };
export interface TraumaEvent {
  description: string;
  eventType: { death_actual: boolean; death_threatened: boolean; injury_actual: boolean; injury_threatened: boolean; sexual_violence_actual: boolean; sexual_violence_threatened: boolean; };
  exposureType: 'direct' | 'witnessed' | 'learned' | 'repeated_exposure' | null;
  ageAtEvent: number | null;
}
const substanceQuestionnaireTemplate = scid5cv_data.filter(q => q.type === 'substance_questionnaire' || (q.id.includes('_GENERIC') && q.type === 'calculation'));

export const Scid5CvPage: React.FC = () => {
    const { clientId, sessionId } = useParams<{ clientId: string; sessionId: string }>();
    const navigate = useNavigate();
    const noteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [phase, setPhase] = useState<TestPhase>('loading');
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
    const [sessionData, setSessionData] = useState<any>(null);
    const [debouncedSessionNote] = useDebounce(sessionNote, 1000);

    // Navigation handlers
    const handleBackToClientDetail = useCallback(() => {
        navigate(`/clients/${clientId}?tab=tests`);
    }, [navigate, clientId]);

    const handleBackToGeneralAssessment = useCallback(() => {
        setPhase('general_assessment');
    }, []);

    const handleBackToModuleSelection = useCallback(() => {
        setPhase('module_selection');
    }, []);

    const handleExitTest = useCallback(async () => {
        // Eğer test tamamlandıysa (phase === 'completed'), uyarı gösterme
        if (phase === 'completed') {
            navigate(`/clients/${clientId}?tab=test-history`);
            return;
        }
        
        // Test devam ediyorsa uyarı göster
        const confirmExit = window.confirm(
            'Testten çıkmak istediğinizden emin misiniz?\nKaydedilmemiş verileriniz kaybolabilir. Bu işlemi geri alamazsınız.'
        );
        
        if (confirmExit) {
            navigate(`/clients/${clientId}?tab=tests`);
        }
    }, [navigate, clientId, phase]);

    // --- Başlangıç Veri Yükleme ---
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!clientId || !sessionId) return;

            const clientPromise = supabase.from('clients').select('id, full_name').eq('id', clientId).single();
            const sessionPromise = supabase.from('scid_sessions').select('created_at, session_wide_note, trauma_events').eq('id', sessionId).single();
            // DÜZELTME: Mevcut cevapları da yükle
            const answersPromise = supabase.from('scid_answers').select('*').eq('session_id', sessionId);

            const [clientResult, sessionResult, answersResult] = await Promise.all([clientPromise, sessionPromise, answersPromise]);

            if (clientResult.error || !clientResult.data) { 
                toast.error("Danışan bilgileri yüklenemedi."); 
                setLoading(false);
                navigate('/clients'); 
                return; 
            }
            setClientInfo({ id: clientResult.data.id, fullName: clientResult.data.full_name });

            if (sessionResult.data) {
                setSessionDate(sessionResult.data.created_at);
                setSessionNote(sessionResult.data.session_wide_note || '');
                setTraumaEvents(sessionResult.data.trauma_events || {});
            }

            if (answersResult.data) {
                const loadedAnswers = answersResult.data.reduce((acc, ans) => {
                    acc[ans.question_code] = { answer: ans.answer, note: ans.question_specific_note };
                    return acc;
                }, {} as AnswerPayload);
                setAnswers(loadedAnswers);
            }

            setLoading(false);
            setPhase('general_assessment'); // Veri yüklendikten sonra ilk aşamaya geç
        };
        fetchInitialData();
    }, [clientId, sessionId, navigate]);

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

    // Test tamamlandığında status'u güncelle
    const markTestAsCompleted = useCallback(async () => {
        if (!sessionId) return;
        
        try {
            const { error } = await supabase
                .from('scid_sessions')
                .update({ 
                    status: 'completed',
                    updated_at: new Date().toISOString()
                })
                .eq('id', sessionId);
            
            if (error) {
                console.error('Test durumu güncellenemedi:', error);
            } else {
                console.log('Test tamamlandı olarak işaretlendi');
            }
        } catch (err) {
            console.error('Test durumu güncelleme hatası:', err);
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

    // Geri gitme fonksiyonu
    const handlePrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }, [currentQuestionIndex]);

    const handleNext = useCallback((calculatedResult?: string) => {
        const question = questionsToAsk[currentQuestionIndex];
        if (!question) {
            setPhase('completed');
            markTestAsCompleted(); // Testi tamamlandı olarak işaretle
            return;
        }

        if (question.id === 'SCID_END' || currentQuestionIndex >= questionsToAsk.length - 1) {
            setPhase('completed');
            markTestAsCompleted(); // Testi tamamlandı olarak işaretle
            return;
        }
        
        let skipTargetId: string | null = null;
        const currentAnswer = calculatedResult ?? answers[question.id]?.answer;

        // 1. ÖNCELİK: Özel 'check' koşullu atlama mantığı
        if (question.skipLogic?.check) {
            if (question.skipLogic.check === 'A1_A2_HAYIR' && answers['A1']?.answer === '-' && answers['A2']?.answer === '-') {
                skipTargetId = question.skipLogic.target;
            } else if (question.skipLogic.check === 'A15_A16_HAYIR' && answers['A15']?.answer === '-' && answers['A16']?.answer === '-') {
                skipTargetId = question.skipLogic.target;
            }
        }
        // 2. ÖNCELİK: Cevaba dayalı basit atlama mantığı
        else if (currentAnswer && question.skipLogic?.[currentAnswer]) {
            skipTargetId = question.skipLogic[currentAnswer];
        }
        // 3. ÖNCELİK: Her durumda atlama ('*')
        else if (question.skipLogic?.['*']) {
            skipTargetId = question.skipLogic['*'];
        }

        // Eğer bir atlama hedefi bulunduysa, oraya git
        if (skipTargetId) {
            const nextIndex = findQuestionIndexById(skipTargetId);
            setCurrentQuestionIndex(nextIndex !== -1 ? nextIndex : currentQuestionIndex + 1);
        } 
        // 4. ÖNCELİK: Madde anketi döngüsü mantığı
        else if (question.id.includes('_GENERIC')) {
            const nextSubstanceQuestionIndex = substanceQuestionnaireIndex + 1;
            if (nextSubstanceQuestionIndex >= substanceQuestionnaireTemplate.length) {
                const nextSubstanceIndex = currentSubstanceIndex + 1;
                if (nextSubstanceIndex >= selectedSubstances.length) {
                    const nextModuleIndex = findQuestionIndexById('F1'); // Modül E'den sonra F1 gelir
                    setCurrentQuestionIndex(nextModuleIndex !== -1 ? nextModuleIndex : questionsToAsk.length);
                } else {
                    setCurrentSubstanceIndex(nextSubstanceIndex);
                    setSubstanceQuestionnaireIndex(0);
                    // Ana index aynı kalır, bir sonraki madde için döngü baştan başlar
                }
            } else {
                setSubstanceQuestionnaireIndex(nextSubstanceQuestionIndex);
            }
        } 
        // 5. ÖNCELİK: Normal ilerleme
        else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, questionsToAsk, answers, findQuestionIndexById, substanceQuestionnaireIndex, selectedSubstances]);

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
                handleNext(answer);
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

    useEffect(() => {
        const currentQuestion = questionsToAsk[currentQuestionIndex];
        
        // Sadece 'calculation' tipindeki sorular için ve henüz cevaplanmamışsa çalış
        if (currentQuestion?.type === 'calculation' && !answers[currentQuestion.id] && currentQuestion.calculation) {
            setIsCalculating(true);

            // Hesaplama mantığı
            const { sources, condition, threshold, contextSourceId } = currentQuestion.calculation;
            let calculatedValue: string = 'HAYIR'; // Varsayılan

            if (condition === 'any_positive') {
                if (sources.some(id => answers[id]?.answer === '+')) calculatedValue = 'EVET';
            } else if (condition === 'count_positive') {
                const count = sources.filter(id => answers[id]?.answer === '+').length;
                if (threshold && count >= threshold) calculatedValue = 'EVET';
            } else if (condition === 'count_positive_mania') {
                const moodAnswer = contextSourceId ? answers[contextSourceId]?.answer : null;
                const effectiveThreshold = (moodAnswer === 'irritable') ? 4 : 3;
                const count = sources.filter(id => answers[id]?.answer === '+').length;
                if (count >= effectiveThreshold) calculatedValue = 'EVET';
            } else if (condition === 'schizophrenia_A') {
                const coreSymptoms = ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14','B15','B16','B17','B18','B19','B20'];
                const positiveSymptoms = sources.filter(id => answers[id]?.answer === '+');
                if (positiveSymptoms.length >= 2 && positiveSymptoms.some(id => coreSymptoms.includes(id))) {
                    calculatedValue = 'EVET';
                }
            } else if (condition === 'bipolar_II_check') {
                const hasHipomania = ['A53', 'A77'].some(id => answers[id]?.answer === '+');
                const hasDepression = ['A12', 'A26'].some(id => answers[id]?.answer === '+');
                if (hasHipomania && hasDepression) calculatedValue = 'EVET';
            } else if (condition === 'count_positive_severity') {
                const count = sources.reduce((acc, sourceId) => answers[`${sourceId}_${selectedSubstances[currentSubstanceIndex]}`]?.answer === '+' ? acc + 1 : acc, 0);
                if (count >= 6) calculatedValue = 'Ağır';
                else if (count >= 4) calculatedValue = 'Orta';
                else if (count >= 2) calculatedValue = 'Ağır Olmayan';
                else calculatedValue = 'Tanı Yok';
            }

            // Sonucu hem state'e hem veritabanına kaydet
            handleAnswer(currentQuestion.id, calculatedValue);
            
            // Hesaplama mesajını kaldırdık - artık timeout'a gerek yok
            setIsCalculating(false);
        }
    }, [currentQuestionIndex, questionsToAsk, answers, handleAnswer]);

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
            // Genel değerlendirme sorularının cevaplarını ve notlarını ayır
            const generalAnswers: { [key: string]: any } = {};
            const generalNotes: { [key: string]: string } = {};
            
            Object.entries(answers).forEach(([questionId, data]) => {
                if (questionId.startsWith('gen_')) {
                    generalAnswers[questionId] = data.answer;
                    if (data.note) {
                        generalNotes[questionId] = data.note;
                    }
                }
            });

            return (
                <GeneralAssessment 
                    onProceed={handleProceedToModules}
                    onBack={handleBackToClientDetail}
                    onExit={handleExitTest}
                    sessionId={sessionId}
                    initialAnswers={generalAnswers}
                    initialNotes={generalNotes}
                />
            );
        }

        if (phase === 'module_selection') {
            // Seçilen modülleri session'dan al
            const selectedModules = sessionData?.selected_modules 
                ? JSON.parse(sessionData.selected_modules) 
                : [];

            return (
                <ModuleSelector 
                    onStart={handleStartQuestioning}
                    onBack={handleBackToGeneralAssessment}
                    onExit={handleExitTest}
                    sessionId={sessionId}
                    initialSelectedModules={selectedModules}
                />
            );
        }

        if (phase === 'completed') {
            // Test tamamlandığında status'u güncelle
            markTestAsCompleted();
            
            return (
                <SessionReport
                    answers={answers}
                    allQuestions={questionsToAsk}
                    sessionNote={sessionNote}
                    clientName={clientInfo?.fullName || 'Bilinmeyen'}
                    sessionDate={sessionDate}
                    onBack={() => setPhase('questioning')}
                    onExit={handleExitTest}
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
                            onPrevious={handlePrevious}
                            canGoBack={currentQuestionIndex > 0}
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
                    onBack={handleBackToModuleSelection}
                    onExit={handleExitTest}
                />
            );
        }

        return null;
    };

    return renderContent();
};