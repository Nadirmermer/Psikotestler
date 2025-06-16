// src/features/scid/components/ModuleSelector.tsx

import React, { useState } from 'react';
import { scid5cv_modules } from '@/features/scid/data/scid.modules';
import { Check, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModuleSelectorProps {
  onStart: (selectedModules: string[]) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ onStart }) => {
  const [selected, setSelected] = useState<string[]>([]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transform transition-all">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">SCID-5-CV Modül Seçimi</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Lütfen görüşmede uygulamak istediğiniz modülleri seçin.</p>
        
        <div className="flex justify-center gap-4 mb-8">
            <Button variant="link" onClick={selectAll}>Tümünü Seç</Button>
            <Button variant="link" onClick={deselectAll} className="text-red-500">Tüm Seçimi Kaldır</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scid5cv_modules.map(module => {
            const isSelected = selected.includes(module.id);
            return (
              <button
                key={module.id}
                onClick={() => toggleModule(module.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ease-in-out flex items-center gap-4 text-left transform hover:-translate-y-1 ${
                  isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 shadow-md' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    {isSelected && <Check className="w-5 h-5 text-white"/>}
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{module.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center">
          <Button
            size="lg"
            onClick={() => onStart(selected)}
            disabled={selected.length === 0}
            className="w-full max-w-xs text-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Görüşmeye Başla ({selected.length} Modül)
          </Button>
          {selected.length === 0 && <p className="text-sm text-red-500 mt-2">Başlamak için en az bir modül seçmelisiniz.</p>}
        </div>
      </div>
    </div>
  );
};