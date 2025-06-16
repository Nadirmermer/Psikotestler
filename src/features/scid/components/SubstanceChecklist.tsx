// src/features/scid/components/SubstanceChecklist.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Substance {
  id: string;
  name: string;
}

interface SubstanceChecklistProps {
  questionText: string;
  substances: Substance[];
  onComplete: (selectedSubstances: string[]) => void;
}

export const SubstanceChecklist: React.FC<SubstanceChecklistProps> = ({ questionText, substances, onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleCheckboxChange = (substanceId: string, checked: boolean) => {
    setSelected(prev =>
      checked ? [...prev, substanceId] : prev.filter(id => id !== substanceId)
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Madde Kullanım Tarama</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{questionText}</p>

        <div className="space-y-4">
          {substances.map(substance => (
            <div key={substance.id} className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md">
              <Checkbox
                id={substance.id}
                onCheckedChange={(checked) => handleCheckboxChange(substance.id, checked as boolean)}
                checked={selected.includes(substance.id)}
              />
              <Label htmlFor={substance.id} className="text-md font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
                {substance.name}
              </Label>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={() => onComplete(selected)}>
            Devam Et ({selected.length} Madde Seçili)
          </Button>
        </div>
      </div>
    </div>
  );
};