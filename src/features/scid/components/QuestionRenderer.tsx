// src/features/scid/components/QuestionRenderer.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScidQuestion } from '@/features/scid/data/scid5cv.data';
import { CheckCircle2, XCircle, AlertCircle, Info, ChevronRight } from 'lucide-react';

interface QuestionRendererProps {
  question: ScidQuestion;
  currentAnswer?: any;
  onAnswer: (questionId: string, answer: any) => void;
  onNext?: () => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  question, 
  currentAnswer, 
  onAnswer,
  onNext
}) => {
  
  // Instruction tipi sorular
  if (question.type === 'instruction') {
    return (
      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{question.text}</ReactMarkdown>
          </div>
        </div>
        
        {/* İleri Butonu */}
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>İleri</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Normal sorular
  return (
    <div className="space-y-6">
      
      {/* Soru Metni */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{question.text}</ReactMarkdown>
      </div>

      {/* Cevap Seçenekleri */}
      {question.options && question.options.length > 0 ? (
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = currentAnswer === opt.value;
            
            // Cevap tipine göre stil belirleme
            let buttonClass = '';
            let icon = null;
            
            if (opt.value === '+' || opt.value === 'EVET') {
              icon = <CheckCircle2 className="h-5 w-5" />;
              buttonClass = isSelected 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30';
            } else if (opt.value === '-' || opt.value === 'HAYIR') {
              icon = <XCircle className="h-5 w-5" />;
              buttonClass = isSelected 
                ? 'bg-red-600 text-white border-red-600' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30';
            } else if (opt.value === '?' || opt.value === 'BELİRSİZ') {
              icon = <AlertCircle className="h-5 w-5" />;
              buttonClass = isSelected 
                ? 'bg-yellow-600 text-white border-yellow-600' 
                : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
            } else {
              icon = <CheckCircle2 className="h-5 w-5" />;
              buttonClass = isSelected 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30';
            }

            return (
              <button
                key={opt.value}
                onClick={() => onAnswer(question.id, opt.value)}
                className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center space-x-3 text-left ${buttonClass}`}
              >
                {icon}
                <span className="font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        // Seçeneksiz sorular için İleri butonu
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>İleri</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Seçilen Cevap */}
      {currentAnswer && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-gray-600 dark:text-gray-400">Seçilen:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {question.options?.find(opt => opt.value === currentAnswer)?.label || currentAnswer}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};