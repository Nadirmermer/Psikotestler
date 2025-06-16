// src/features/scid/components/ScidTestLayout.tsx

import React from 'react';
import { 
  BookOpen,
  StickyNote,
  FileText
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
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      
      {/* Basit Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">SCID-5-CV</h1>
              <p className="text-sm text-gray-500">{clientName} • Modül: {currentModule}</p>
            </div>
          </div>
          
          {totalQuestions > 0 && (
            <div className="text-right">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Ana İçerik - 2 Kolon */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sol Taraf - Sorular */}
        <div className="flex-1 flex flex-col">
          
          {/* Soru Alanı */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {questionArea}
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Kriterler ve Seans Notları */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          
          {/* DSM-5 Kriterleri */}
          <div className="flex-1 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-gray-900 dark:text-white">DSM-5 Kriterleri</h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 h-64 overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                {criteriaArea}
              </div>
            </div>
          </div>

          {/* Soru Notu */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <StickyNote className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Soru Notu</span>
            </div>
            {questionNoteArea}
          </div>

          {/* Seans Notları */}
          <div className="flex-1 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-gray-900 dark:text-white">Seans Notları</h3>
            </div>
            <textarea
              value={sessionNote}
              onChange={(e) => onSessionNoteChange(e.target.value)}
              placeholder="Seans notlarınızı buraya yazın..."
              className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};