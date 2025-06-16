// src/features/scid/components/TraumaSelector.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { TraumaEvent } from '@/pages/Scid5CvPage'; // Tipi yine ana sayfadan alalım

interface TraumaSelectorProps {
  traumaEvents: { [key: string]: TraumaEvent };
  onSelect: (selectedEventId: string) => void;
}

export const TraumaSelector: React.FC<TraumaSelectorProps> = ({ traumaEvents, onSelect }) => {
  const validEvents = Object.entries(traumaEvents).filter(([, event]) => event.description.trim() !== '');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-700 rounded-lg shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Değerlendirilecek Travmayı Seçin</h2>
        <p className="text-center text-gray-500 dark:text-gray-300">Görüşmenin geri kalanında aşağıdaki olaylardan hangisine odaklanacaksınız?</p>
        
        <div className="space-y-4">
          {validEvents.length > 0 ? validEvents.map(([id, event]) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <p className="font-bold">Olay {id.replace('G', '')}:</p>
              <p className="truncate text-gray-700 dark:text-gray-200">{event.description}</p>
            </button>
          )) : <p className="text-center text-gray-500">Değerlendirilecek bir travma olayı girilmedi.</p>}
        </div>
      </div>
    </div>
  );
};