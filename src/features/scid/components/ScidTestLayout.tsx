// src/features/scid/components/ScidTestLayout.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Brain, 
  User, 
  BookOpen, 
  ChevronLeft, 
  Save,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
  currentModule = "Genel"
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50">
      
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Sol Taraf - Logo ve Bilgiler */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/clients')}
                className="group flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <ChevronLeft className="h-5 w-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
                </div>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">SCID-5-CV</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Progress ve Tema */}
            <div className="flex items-center space-x-4">
              {/* Progress Bar */}
              {totalQuestions > 0 && (
                <div className="hidden md:flex items-center space-x-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                  <div className="w-32">
                    <Progress 
                      value={progressPercentage} 
                      className="h-2 bg-gray-200 dark:bg-gray-700"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              )}

              {/* Tema Değiştirici */}
              <button
                onClick={toggleTheme}
                className="group w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-indigo-500 dark:to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {theme === 'dark' ? (
                  <Sun className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                ) : (
                  <Moon className="h-6 w-6 text-white group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

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
                  {questionNoteArea}
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
                    onChange={(e) => onSessionNoteChange(e.target.value)}
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