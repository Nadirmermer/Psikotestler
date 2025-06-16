import React from 'react';
import { Button } from '@/components/ui/button';
import { TraumaEvent } from '@/pages/Scid5CvPage';

interface TraumaSelectorProps {
  traumaEvents: { [key: string]: TraumaEvent };
  onSelect: (selectedEventId: string) => void;
  onSkip: () => void;
}

export const TraumaSelector: React.FC<TraumaSelectorProps> = ({ traumaEvents, onSelect, onSkip }) => {
  const validEvents = Object.entries(traumaEvents).filter(([, event]) => event && event.description.trim() !== '');

  if (validEvents.length === 0) {
    // Eğer hiç travma girilmediyse, bu ekranı göstermeden direkt atla.
    // Bu mantık ana bileşende de kontrol edilebilir, ama burada da bir güvenlik önlemi.
    React.useEffect(() => { onSkip(); }, [onSkip]);
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-700 rounded-lg shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Değerlendirilecek Travmayı Seçin</h2>
        <p className="text-center text-gray-500 dark:text-gray-300">Görüşmenin geri kalanında aşağıdaki olaylardan hangisine odaklanacaksınız?</p>
        <div className="space-y-4">
          {validEvents.map(([id, event]) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <p className="font-bold">Olay {id.replace('G', '')}:</p>
              <p className="truncate text-gray-700 dark:text-gray-200">{event.description}</p>
            </button>
          ))}
        </div>
         <div className="text-center mt-6">
            <Button variant="link" onClick={onSkip}>Travma Değerlendirmesini Atla</Button>
        </div>
      </div>
    </div>
  );
};