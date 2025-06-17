// src/features/scid/components/GeneralAssessment.tsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { genelDegerlendirme_data } from '../data/genel-degerlendirme.data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScidTestHeader } from './ScidTestHeader';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, FileText, Sparkles, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface GeneralAssessmentProps {
  onProceed: () => void;
  onBack?: () => void;
  onExit?: () => void;
  sessionId?: string;
  initialAnswers?: { [key: string]: any };
  initialNotes?: { [key: string]: string };
}

export const GeneralAssessment: React.FC<GeneralAssessmentProps> = ({ 
  onProceed, 
  onBack, 
  onExit,
  sessionId,
  initialAnswers = {},
  initialNotes = {}
}) => {
  const [notes, setNotes] = useState<{ [key: string]: string }>(initialNotes);
  const [answers, setAnswers] = useState<{ [key: string]: any }>(initialAnswers);
  
  // Debounce için timer referansları
  const noteTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const answerTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleNoteChange = useCallback((id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
    
    // Önceki timer'ı temizle
    if (noteTimers.current[id]) {
      clearTimeout(noteTimers.current[id]);
    }
    
    // Yeni timer başlat (1 saniye bekle)
    if (sessionId) {
      noteTimers.current[id] = setTimeout(() => {
        saveNote(id, value);
      }, 1000);
    }
  }, [sessionId]);

  const handleAnswerChange = useCallback((id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    
    // Önceki timer'ı temizle
    if (answerTimers.current[id]) {
      clearTimeout(answerTimers.current[id]);
    }
    
    // Yeni timer başlat (500ms bekle - cevaplar daha hızlı kaydedilsin)
    if (sessionId) {
      answerTimers.current[id] = setTimeout(() => {
        saveAnswer(id, value);
      }, 500);
    }
  }, [sessionId]);

  // Component unmount olduğunda timer'ları temizle
  useEffect(() => {
    return () => {
      Object.values(noteTimers.current).forEach(timer => clearTimeout(timer));
      Object.values(answerTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Veritabanına kaydetme fonksiyonları
  const saveAnswer = useCallback(async (questionId: string, answer: any) => {
    if (!sessionId) return;
    
    try {
      const { error } = await supabase
        .from('scid_answers')
        .upsert({
          session_id: sessionId,
          question_code: questionId,
          answer: answer?.toString(),
          question_specific_note: notes[questionId] || null
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
  }, [sessionId, notes]);

  const saveNote = useCallback(async (questionId: string, note: string) => {
    if (!sessionId) return;
    
    try {
      const { error } = await supabase
        .from('scid_answers')
        .upsert({
          session_id: sessionId,
          question_code: questionId,
          answer: answers[questionId]?.toString() || null,
          question_specific_note: note || null
        }, {
          onConflict: 'session_id,question_code'
        });
      
      if (error) {
        console.error('Not kaydetme hatası:', error);
      }
    } catch (err) {
      console.error('Not kaydetme hatası:', err);
    }
  }, [sessionId, answers]);

  // Manuel kaydetme fonksiyonu
  const saveAllData = useCallback(async () => {
    if (!sessionId) {
      toast.error('Oturum ID bulunamadı');
      return;
    }

    try {
      const savePromises = [];
      
      // Tüm cevapları ve notları kaydet
      for (const [questionId, answer] of Object.entries(answers)) {
        savePromises.push(
          supabase
            .from('scid_answers')
            .upsert({
              session_id: sessionId,
              question_code: questionId,
              answer: answer?.toString(),
              question_specific_note: notes[questionId] || null
            }, {
              onConflict: 'session_id,question_code'
            })
        );
      }

      // Sadece not olan soruları da kaydet
      for (const [questionId, note] of Object.entries(notes)) {
        if (!answers[questionId] && note) {
          savePromises.push(
            supabase
              .from('scid_answers')
              .upsert({
                session_id: sessionId,
                question_code: questionId,
                answer: null,
                question_specific_note: note
              }, {
                onConflict: 'session_id,question_code'
              })
          );
        }
      }

      await Promise.all(savePromises);
      toast.success('Tüm veriler kaydedildi');
    } catch (err) {
      console.error('Toplu kaydetme hatası:', err);
      toast.error('Veriler kaydedilemedi');
    }
  }, [sessionId, answers, notes]);

  // Sorunun gösterilip gösterilmeyeceğini kontrol eden fonksiyon
  const shouldShowQuestion = (question: any) => {
    if (!question.skipLogic) return true;
    
    for (const [dependentQuestionId, expectedValue] of Object.entries(question.skipLogic)) {
      const actualValue = answers[dependentQuestionId];
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    return true;
  };

  // Soruları bölümlerine göre gruplayalım ve koşullu soruları filtreleyelim
  const sections = [...new Set(genelDegerlendirme_data.map(q => q.section))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50">
      
      {/* Header */}
      <ScidTestHeader
        title="SCID-5-CV Genel Değerlendirme"
        subtitle="Görüşmenin genel özetini çıkarmak ve modül seçimine yardımcı olmak için"
        onBack={onBack}
        onExit={onExit}
        backButtonText="Danışan Detayına Dön"
      />

      {/* Ana İçerik */}
      <div className="max-w-5xl mx-auto p-6 pt-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          
          {/* Açıklama Kartı */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 mb-8 border border-blue-200/50 dark:border-blue-700/50">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Genel Değerlendirme Notları
                </h3>
                <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                  Bu bölümdeki notlar görüşmenin genel bir özetini çıkarmak ve modül seçimine yardımcı olmak için kullanılır. 
                  <strong> Doldurulması zorunlu değildir.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Bölümler */}
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <div key={section} className="bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-gray-700/30 dark:to-gray-800/30 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-600/30 shadow-lg backdrop-blur-sm">
                
                {/* Bölüm Başlığı */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {sectionIndex + 1}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {section}
                </h2>
                </div>

                {/* Sorular */}
                <div className="space-y-6">
                  {genelDegerlendirme_data
                    .filter(q => q.section === section)
                    .filter(shouldShowQuestion)
                    .map(q => (
                    <div key={q.id} className="space-y-3">
                      
                      {/* Soru Etiketi */}
                      <label htmlFor={q.id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown components={{ p: 'span' }}>{q.text}</ReactMarkdown>
                        </div>
                      </label>
                      
                      {/* Input Alanı */}
                      {q.type === 'instruction' ? (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
                          <p className="text-sm italic text-amber-700 dark:text-amber-300 flex items-center space-x-2">
                            <Sparkles className="h-4 w-4" />
                            <span>Bu bir yönlendirme notudur, girdi alanı yoktur.</span>
                          </p>
                        </div>
                      ) : q.type === 'question' ? (
                        <div className="space-y-3">
                          {/* Seçenekler */}
                          <div className="grid grid-cols-1 gap-3">
                            {q.options?.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => handleAnswerChange(q.id, option.value)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                  answers[q.id] === option.value
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300'
                                    : 'bg-white/70 dark:bg-gray-700/70 border-gray-300/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    answers[q.id] === option.value
                                      ? 'bg-blue-500 border-blue-500'
                                      : 'border-gray-300 dark:border-gray-600'
                                  }`}>
                                    {answers[q.id] === option.value && (
                                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                    )}
                                  </div>
                                  <span className="font-medium">{option.label}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          {/* Not alanı */}
                          <Textarea
                            value={notes[q.id] || ''}
                            onChange={(e) => handleNoteChange(q.id, e.target.value)}
                            rows={2}
                            className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                            placeholder="Bu soruyla ilgili notlarınızı buraya yazın..."
                          />
                        </div>
                      ) : q.type === 'text' ? (
                        <Input
                          id={q.id}
                          value={notes[q.id] || ''}
                          onChange={(e) => handleNoteChange(q.id, e.target.value)}
                          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          placeholder="Notlarınızı buraya yazın..."
                        />
                      ) : (
                        <Textarea
                          id={q.id}
                          value={notes[q.id] || ''}
                          onChange={(e) => handleNoteChange(q.id, e.target.value)}
                          rows={4}
                          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                          placeholder="Detaylı notlarınızı buraya yazın..."
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Alt Butonlar */}
          <div className="mt-12 flex flex-col items-center gap-4">
            
            {/* İleri Butonu */}
            <Button
              size="lg"
              onClick={onProceed}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white rounded-2xl transition-all duration-300 flex items-center space-x-3 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Modül Seçimine Geç</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Glow efekti */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </Button>

            {/* İpucu */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ✨ Verileriniz otomatik olarak kaydediliyor. Formu doldurmanız opsiyoneldir.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Doldurursanız kaydedilir, doldurmazsanız direkt modül seçimine geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};