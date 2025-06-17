// src/features/scid/components/ModuleSelector.tsx

import React, { useState, useEffect } from 'react';
import { scid5cv_modules } from '@/features/scid/data/scid.modules';
import { Check, Play, CheckSquare, Square, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScidTestHeader } from './ScidTestHeader';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface ModuleSelectorProps {
  onStart: (selectedModules: string[]) => void;
  onBack?: () => void;
  onExit?: () => void;
  sessionId?: string;
  initialSelectedModules?: string[];
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ 
  onStart, 
  onBack, 
  onExit,
  sessionId,
  initialSelectedModules = []
}) => {
  const [selected, setSelected] = useState<string[]>(initialSelectedModules);

  // Seçilen modülleri kaydet
  useEffect(() => {
    if (sessionId && selected.length > 0) {
      saveSelectedModules();
    }
  }, [selected, sessionId]);

  const saveSelectedModules = async () => {
    if (!sessionId) return;
    
    try {
      const { error } = await supabase
        .from('scid_sessions')
        .update({
          selected_modules: JSON.stringify(selected)
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Modül seçimi kaydedilemedi:', error);
      }
    } catch (error) {
      console.error('Modül seçimi kaydedilemedi:', error);
    }
  };

  const toggleModule = (moduleId: string) => {
    setSelected(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectAll = () => {
    setSelected(scid5cv_modules.map(m => m.id));
  };

  const deselectAll = () => {
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50">
      
      {/* Header */}
      <ScidTestHeader
        title="SCID-5-CV Modül Seçimi"
        subtitle="Görüşmede uygulamak istediğiniz modülleri seçin"
        onBack={onBack}
        onExit={onExit}
        backButtonText="Genel Değerlendirmeye Dön"
      />

      {/* Ana İçerik */}
      <div className="max-w-4xl mx-auto p-6 pt-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          
          {/* Hızlı Seçim Butonları */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={selectAll}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-800/50 dark:hover:to-green-800/50 transition-all duration-200 hover:scale-105"
            >
              <CheckSquare className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Tümünü Seç</span>
            </button>
            <button
              onClick={deselectAll}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 rounded-2xl border border-red-200/50 dark:border-red-700/50 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800/50 dark:hover:to-rose-800/50 transition-all duration-200 hover:scale-105"
            >
              <Square className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Tüm Seçimi Kaldır</span>
            </button>
          </div>

          {/* Modül Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {scid5cv_modules.map((module, index) => {
              const isSelected = selected.includes(module.id);
              return (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ease-out flex items-center gap-4 text-left transform hover:scale-105 hover:shadow-xl backdrop-blur-sm ${
                    isSelected 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/50 dark:via-indigo-900/50 dark:to-blue-800/50 shadow-lg shadow-blue-500/25' 
                      : 'border-gray-300/50 dark:border-gray-600/50 bg-gradient-to-br from-white/50 to-gray-50/30 dark:from-gray-700/30 dark:to-gray-800/30 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  {/* Seçim İndikatörü */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg' 
                      : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-700 dark:group-hover:to-indigo-700'
                  }`}>
                    {isSelected ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-sm font-bold ${
                        isSelected 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                    )}
                  </div>
                  
                  {/* Modül Adı */}
                  <div className="flex-1">
                    <span className={`font-semibold text-lg transition-colors duration-300 ${
                      isSelected 
                        ? 'text-blue-800 dark:text-blue-200' 
                        : 'text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                    }`}>
                      {module.name}
                    </span>
                  </div>

                  {/* Seçim Animasyonu */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl animate-pulse pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Başlat Butonu */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              size="lg"
              onClick={() => onStart(selected)}
              disabled={selected.length === 0}
              className={`group relative px-12 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform ${
                selected.length > 0
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white hover:scale-105'
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <Play className={`h-5 w-5 transition-transform duration-300 ${selected.length > 0 ? 'group-hover:scale-110' : ''}`} />
              <span>Görüşmeye Başla</span>
              {selected.length > 0 && (
                <>
                  <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
                    {selected.length}
                  </div>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
              
              {/* Glow efekti */}
              {selected.length > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              )}
            </Button>
            
            {/* Uyarı Mesajı */}
            {selected.length === 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-4 border border-amber-200/50 dark:border-amber-700/50">
                <p className="text-amber-700 dark:text-amber-300 text-sm font-medium flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Başlamak için en az bir modül seçmelisiniz.</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};