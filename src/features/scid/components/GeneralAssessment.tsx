// src/features/scid/components/GeneralAssessment.tsx

import React, { useState } from 'react';
import { genelDegerlendirme_data, AssessmentQuestion } from '../data/genel-degerlendirme.data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';

interface GeneralAssessmentProps {
  onProceed: (notes: { [key: string]: string }) => void;
}

export const GeneralAssessment: React.FC<GeneralAssessmentProps> = ({ onProceed }) => {
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const handleNoteChange = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  // Soruları bölümlerine göre gruplayalım
  const sections = [...new Set(genelDegerlendirme_data.map(q => q.section))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Genel Değerlendirme</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Bu bölümdeki notlar görüşmenin genel bir özetini çıkarmak ve modül seçimine yardımcı olmak için kullanılır. Doldurulması zorunlu değildir.
          </p>

          <div className="space-y-8">
            {sections.map(section => (
              <div key={section}>
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-200 dark:border-blue-800 pb-2 mb-4">
                  {section}
                </h2>
                <div className="space-y-6">
                  {genelDegerlendirme_data.filter(q => q.section === section).map(q => (
                    <div key={q.id}>
                      <label htmlFor={q.id} className="block text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                        <ReactMarkdown components={{ p: 'span' }}>{q.text}</ReactMarkdown>
                      </label>
                      {q.type === 'instruction' ? (
                        <p className="text-sm italic text-gray-500 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">Bu bir yönlendirme notudur, girdi alanı yoktur.</p>
                      ) : q.type === 'text' ? (
                        <Input
                          id={q.id}
                          value={notes[q.id] || ''}
                          onChange={(e) => handleNoteChange(q.id, e.target.value)}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      ) : (
                        <Textarea
                          id={q.id}
                          value={notes[q.id] || ''}
                          onChange={(e) => handleNoteChange(q.id, e.target.value)}
                          rows={4}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => onProceed(notes)}>
              Modül Seçimine Geç
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};