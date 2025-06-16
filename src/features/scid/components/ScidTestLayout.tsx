// src/features/scid/components/ScidTestLayout.tsx

import React from 'react';
import { PanelLeft, BookOpen, StickyNote } from 'lucide-react';

interface ScidTestLayoutProps {
  questionArea: React.ReactNode;
  criteriaArea: React.ReactNode;
  questionNoteArea: React.ReactNode;
  sessionNoteArea: React.ReactNode;
  sessionNote: string;
  onSessionNoteChange: (note: string) => void;
}

export const ScidTestLayout: React.FC<ScidTestLayoutProps> = ({
  questionArea,
  criteriaArea,
  questionNoteArea,
  sessionNoteArea,
  sessionNote,
  onSessionNoteChange
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Üst Bilgi Alanı */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">SCID-5-CV Görüşmesi</h1>
        {/* Buraya danışan adı, zamanlayıcı gibi ek bilgiler gelebilir */}
      </header>
      
      {/* Ana Çalışma Alanı */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 overflow-y-auto">
        
        {/* Sol Taraf: Sorular ve Soru Notları (%75) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow p-6 overflow-y-auto">
            {questionArea}
          </div>
          <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-2 flex items-center"><StickyNote className="h-4 w-4 mr-2 text-yellow-500"/> Soruya Özel Not</h3>
            {questionNoteArea}
          </div>
        </div>

        {/* Sağ Taraf: DSM-5 Kriterleri ve Seans Notları (%25) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-y-auto">
            <h3 className="text-md font-semibold mb-2 flex items-center"><BookOpen className="h-4 w-4 mr-2 text-blue-500"/> DSM-5 Kriterleri</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {criteriaArea}
            </div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
            <h3 className="text-md font-semibold mb-2 flex items-center"><PanelLeft className="h-4 w-4 mr-2 text-green-500"/> Seans Geneli Notlar</h3>
            <textarea
              value={sessionNote}
              onChange={(e) => onSessionNoteChange(e.target.value)}
              placeholder="Seans boyunca görünür kalacak notlarınızı buraya yazın..."
              className="flex-grow w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 resize-none"
            />
          </div>
        </div>
      </main>

       {/* Alt Kontrol Alanı */}
      <footer className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex justify-end items-center gap-3">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Önceki Soru</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Sonraki Soru</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Görüşmeyi Bitir</button>
      </footer>
    </div>
  );
};