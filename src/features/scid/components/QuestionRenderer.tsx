// src/features/scid/components/QuestionRenderer.tsx

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ScidQuestion } from '@/features/scid/data/scid5cv.data';
import { CheckCircle2, XCircle, AlertCircle, Info, ChevronRight, Sparkles } from 'lucide-react';

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
  
  // Klavye kısayolları
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!question.options || question.options.length === 0) return;
      
      if (event.key === '1' && question.options[0]) {
        event.preventDefault();
        onAnswer(question.id, question.options[0].value);
      }
      
      if (event.key === '2' && question.options[1]) {
        event.preventDefault();
        onAnswer(question.id, question.options[1].value);
      }
      
      if (event.key === '3' && question.options[2]) {
        event.preventDefault();
        onAnswer(question.id, question.options[2].value);
      }
      
      if (event.key === 'Enter' && onNext && (!question.options || question.options.length === 0)) {
        event.preventDefault();
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [question, onAnswer, onNext]);
  
  // Instruction tipi sorular
  if (question.type === 'instruction') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl p-8 shadow-xl border border-blue-100/50 dark:border-gray-700/50">
        
        {/* İçerik Alanı */}
        <div className="flex-1 flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-100 leading-relaxed">
              <ReactMarkdown>{question.text}</ReactMarkdown>
            </div>
          </div>
        </div>
        
        {/* Alt Sabit İleri Butonu */}
        <div className="mt-8 pt-6 border-t border-gradient-to-r from-transparent via-blue-200/50 to-transparent dark:via-gray-600/50">
          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 flex items-center space-x-3 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>İleri</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Glow efekti */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-600/50">
              <kbd className="px-3 py-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg text-xs font-mono shadow-sm">Enter</kbd>
              <span>tuşuna basabilirsiniz</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal sorular
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/50 rounded-3xl p-8 shadow-xl border border-gray-100/50 dark:border-gray-700/50">
      
      {/* Soru Metni */}
      <div className="flex-1">
        <div className="prose prose-xl dark:prose-invert max-w-none">
          <div className="text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
            <ReactMarkdown>{question.text}</ReactMarkdown>
          </div>
        </div>

        {/* Seçilen Cevap Gösterimi */}
        {currentAnswer && (
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Seçilen Cevap</div>
                <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                  {question.options?.find(opt => opt.value === currentAnswer)?.label || currentAnswer}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alt Sabit Cevap Butonları */}
      {question.options && question.options.length > 0 ? (
        <div className="mt-8 pt-6 border-t border-gradient-to-r from-transparent via-gray-200/50 to-transparent dark:via-gray-600/50">
          
          {/* Evet/Hayır Butonları */}
          {question.options.length === 2 && (
            <div className="grid grid-cols-2 gap-6">
              {question.options.map((opt, index) => {
                const isSelected = currentAnswer === opt.value;
                let buttonClass = '';
                let icon = null;
                let keyNumber = index + 1;
                
                if (opt.value === '+' || opt.value === 'EVET') {
                  icon = <CheckCircle2 className="h-8 w-8" />;
                  buttonClass = isSelected 
                    ? 'bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 text-white shadow-2xl scale-105 ring-4 ring-emerald-200 dark:ring-emerald-800' 
                    : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-emerald-900/40 dark:via-green-900/40 dark:to-emerald-800/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-800/60 dark:hover:to-green-800/60 hover:scale-102 hover:shadow-xl';
                } else if (opt.value === '-' || opt.value === 'HAYIR') {
                  icon = <XCircle className="h-8 w-8" />;
                  buttonClass = isSelected 
                    ? 'bg-gradient-to-br from-red-500 via-rose-600 to-red-700 text-white shadow-2xl scale-105 ring-4 ring-red-200 dark:ring-red-800' 
                    : 'bg-gradient-to-br from-red-50 via-rose-50 to-red-100 dark:from-red-900/40 dark:via-rose-900/40 dark:to-red-800/40 text-red-700 dark:text-red-300 border-2 border-red-200/50 dark:border-red-700/50 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800/60 dark:hover:to-rose-800/60 hover:scale-102 hover:shadow-xl';
                }

                return (
                  <button
                    key={opt.value}
                    onClick={() => onAnswer(question.id, opt.value)}
                    className={`group relative p-8 rounded-3xl transition-all duration-300 flex flex-col items-center space-y-4 text-center backdrop-blur-sm ${buttonClass}`}
                  >
                    <div className="relative">
                      {icon}
                      {isSelected && (
                        <div className="absolute inset-0 animate-ping">
                          {icon}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-2xl">{opt.label}</span>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-4 py-2 bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-xl text-lg font-mono shadow-sm">
                        {keyNumber}
                      </kbd>
                    </div>
                    
                    {/* Glow efekti */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 3+ Seçenekli Sorular */}
          {question.options.length > 2 && (
            <div className="space-y-4">
              {question.options.map((opt, index) => {
                const isSelected = currentAnswer === opt.value;
                let buttonClass = '';
                let icon = null;
                let keyNumber = index + 1;
                
                if (opt.value === '+' || opt.value === 'EVET') {
                  icon = <CheckCircle2 className="h-6 w-6" />;
                  buttonClass = isSelected 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl ring-2 ring-emerald-300 dark:ring-emerald-700' 
                    : 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-800/50 dark:hover:to-green-800/50';
                } else if (opt.value === '-' || opt.value === 'HAYIR') {
                  icon = <XCircle className="h-6 w-6" />;
                  buttonClass = isSelected 
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl ring-2 ring-red-300 dark:ring-red-700' 
                    : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-700/50 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800/50 dark:hover:to-rose-800/50';
                } else if (opt.value === '?' || opt.value === 'BELİRSİZ') {
                  icon = <AlertCircle className="h-6 w-6" />;
                  buttonClass = isSelected 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-xl ring-2 ring-amber-300 dark:ring-amber-700' 
                    : 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-800/50 dark:hover:to-yellow-800/50';
                } else {
                  icon = <CheckCircle2 className="h-6 w-6" />;
                  buttonClass = isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-300 dark:ring-blue-700' 
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50';
                }

                return (
                  <button
                    key={opt.value}
                    onClick={() => onAnswer(question.id, opt.value)}
                    className={`group w-full p-6 rounded-2xl transition-all duration-300 flex items-center justify-between text-left backdrop-blur-sm hover:scale-102 hover:shadow-lg ${buttonClass}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                        {icon}
                      </div>
                      <span className="font-semibold text-lg">{opt.label}</span>
                    </div>
                    <kbd className="px-4 py-2 bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-xl text-sm font-mono shadow-sm">
                      {keyNumber}
                    </kbd>
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Klavye Kısayol Bilgisi */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center space-x-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Klavye kısayolları:</span>
              {question.options.map((_, index) => (
                <kbd key={index} className="px-3 py-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg text-sm font-mono shadow-sm">
                  {index + 1}
                </kbd>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Seçeneksiz sorular için İleri butonu
        <div className="mt-8 pt-6 border-t border-gradient-to-r from-transparent via-gray-200/50 to-transparent dark:via-gray-600/50">
          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 flex items-center space-x-3 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>İleri</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Glow efekti */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
          <div className="text-center mt-4">
            <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-600/50">
              <kbd className="px-3 py-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg text-xs font-mono shadow-sm">Enter</kbd>
              <span className="text-sm text-gray-500 dark:text-gray-400">tuşuna basabilirsiniz</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};