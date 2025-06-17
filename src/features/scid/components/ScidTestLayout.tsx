// src/features/scid/components/ScidTestLayout.tsx

import React, { useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScidTestHeader } from './ScidTestHeader';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { 
  FileText, 
  BookOpen, 
  User,
  Sparkles
} from 'lucide-react';

interface ScidTestLayoutProps {
  questionArea: React.ReactNode;
  criteriaArea: React.ReactNode;
  questionNoteArea: React.ReactNode;
  sessionNoteArea: React.ReactNode;
  sessionNote: string;
  onSessionNoteChange: (note: string) => void;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  clientName?: string;
  currentModule?: string;
  onBack?: () => void;
  onExit?: () => void;
  sessionId?: string;
  currentQuestionId?: string;
  currentAnswer?: any;
  currentQuestionNote?: string;
  onQuestionNoteChange?: (note: string) => void;
}

export const ScidTestLayout: React.FC<ScidTestLayoutProps> = ({
  questionArea,
  criteriaArea,
  questionNoteArea,
  sessionNoteArea,
  sessionNote,
  onSessionNoteChange,
  currentQuestionIndex = 0,
  totalQuestions = 0,
  clientName = "Danışan",
  currentModule = "Genel",
  onBack,
  onExit,
  sessionId,
  currentQuestionId,
  currentAnswer,
  currentQuestionNote = '',
  onQuestionNoteChange
}) => {
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Seans notunu kaydetme fonksiyonu
  const saveSessionNote = useCallback(async (note: string) => {
    if (!sessionId) return;
    
    try {
      const { error } = await supabase
        .from('scid_sessions')
        .update({ session_note: note })
        .eq('id', sessionId);
      
      if (error) {
        console.error('Seans notu kaydetme hatası:', error);
      }
    } catch (err) {
      console.error('Seans notu kaydetme hatası:', err);
    }
  }, [sessionId]);

  // Soru notunu kaydetme fonksiyonu
  const saveQuestionNote = useCallback(async (questionId: string, note: string) => {
    if (!sessionId || !questionId) return;
    
    try {
      const { error } = await supabase
        .from('scid_answers')
        .upsert({
          session_id: sessionId,
          question_code: questionId,
          answer: currentAnswer?.toString() || null,
          question_specific_note: note || null
        }, {
          onConflict: 'session_id,question_code'
        });
      
      if (error) {
        console.error('Soru notu kaydetme hatası:', error);
      }
    } catch (err) {
      console.error('Soru notu kaydetme hatası:', err);
    }
  }, [sessionId, currentAnswer]);

  // Seans notu değişikliği
  const handleSessionNoteChange = useCallback((note: string) => {
    onSessionNoteChange(note);
    // Otomatik kaydetme
    if (sessionId) {
      saveSessionNote(note);
    }
  }, [onSessionNoteChange, sessionId, saveSessionNote]);

  // Soru notu değişikliği
  const handleQuestionNoteChange = useCallback((note: string) => {
    if (onQuestionNoteChange) {
      onQuestionNoteChange(note);
    }
    // Otomatik kaydetme
    if (sessionId && currentQuestionId) {
      saveQuestionNote(currentQuestionId, note);
    }
  }, [onQuestionNoteChange, sessionId, currentQuestionId, saveQuestionNote]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50">
      
      {/* Header */}
      <ScidTestHeader
        title="SCID-5-CV Görüşme"
        subtitle={
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{clientName}</span>
            </div>
            {currentModule && (
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Modül {currentModule}</span>
              </div>
            )}
            {totalQuestions > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-24">
                  <Progress 
                    value={progressPercentage} 
                    className="h-1.5 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
                <span className="text-xs font-medium">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            )}
          </div>
        }
        onBack={onBack}
        onExit={onExit}
        backButtonText="Modül Seçimine Dön"
      />

      {/* Ana İçerik */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
          
          {/* Sol Panel - Ana Test Alanı */}
          <div className="lg:col-span-2">
            <div className="h-full">
              {questionArea}
            </div>
          </div>

          {/* Sağ Panel - Bilgi ve Notlar */}
          <div className="space-y-6">
            
            {/* DSM-5 Kriterleri */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">DSM-5 Kriterleri</h3>
                </div>
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl p-4 border border-blue-200/30 dark:border-blue-700/30">
                  <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {criteriaArea}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soru Notu */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Soru Notu</h3>
                </div>
                <div className="space-y-4">
                  {questionNoteArea || (
                    <Textarea
                      placeholder="Bu soruyla ilgili notlarınızı buraya yazın..."
                      value={currentQuestionNote}
                      onChange={(e) => handleQuestionNoteChange(e.target.value)}
                      className="min-h-[80px] bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200/50 dark:border-amber-700/50 rounded-2xl resize-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-amber-400/50 transition-all duration-300"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seans Notları */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Seans Notları</h3>
                </div>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Seans geneli notlarınızı buraya yazın..."
                    value={sessionNote}
                    onChange={(e) => handleSessionNoteChange(e.target.value)}
                    className="min-h-[120px] bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-900/20 dark:to-green-900/10 border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl resize-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 transition-all duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};