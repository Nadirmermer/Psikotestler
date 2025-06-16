// src/features/scid/components/SessionReport.tsx

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ClipboardList, BookOpen, AlertTriangle } from 'lucide-react';
import { ScidQuestion } from '../data/scid5cv.data';

// Gerekli prop tiplerini tanımlayalım
interface SessionReportProps {
  answers: { [key: string]: { answer: any; note?: string } };
  allQuestions: ScidQuestion[];
  sessionNote?: string;
  clientName: string;
  sessionDate: string;
}

export const SessionReport: React.FC<SessionReportProps> = ({
  answers,
  allQuestions,
  sessionNote,
  clientName,
  sessionDate,
}) => {

  // Rapor verilerini hesaplamak için useMemo kullanalım
  const reportData = useMemo(() => {
    const diagnoses: string[] = [];
    const possibleConditions: string[] = [];
    const questionNotes: { id: string; text: string; note: string }[] = [];

    // Tüm cevapları ve soruları dolaşarak verileri ayrıştıralım
    for (const question of allQuestions) {
      const answerData = answers[question.id];
      
      // 1. Saptanan Tanılar
      if (question.type === 'summary' && answerData) {
        // "TANI: " ifadesini temizleyerek sadece tanı adını alalım
        const diagnosisText = question.text.replace(/## TANI: /g, '').trim();
        diagnoses.push(diagnosisText);
      }

      // 2. "Olası" Durumlar (Modül I'dan)
      if (question.module === 'I' && answerData?.answer === '+') {
        const conditionText = question.criteria?.replace(/'nu düşünün.*/, '').trim() || 'Bilinmeyen Durum';
        possibleConditions.push(conditionText);
      }

      // 3. Soruya Özel Notlar
      if (answerData?.note && answerData.note.trim() !== '') {
        questionNotes.push({
          id: question.id,
          text: question.text.split('\n')[0], // Sorunun ilk satırını alalım
          note: answerData.note,
        });
      }
    }

    return { diagnoses, possibleConditions, questionNotes };
  }, [answers, allQuestions]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none">
        <header className="flex justify-between items-start mb-8 pb-4 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SCID-5-CV Görüşme Raporu</h1>
            <p className="text-md text-gray-500 dark:text-gray-300">Danışan: {clientName}</p>
            <p className="text-md text-gray-500 dark:text-gray-300">Tarih: {new Date(sessionDate).toLocaleDateString('tr-TR')}</p>
          </div>
          <Button onClick={handlePrint} variant="outline" className="print:hidden">
            <Printer className="mr-2 h-4 w-4" /> Yazdır
          </Button>
        </header>

        <main className="space-y-8">
          {/* Saptanan Tanılar Bölümü */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-600 dark:text-blue-400">
              <ClipboardList className="mr-3 h-6 w-6" /> Algoritmaya Göre Saptanan Tanılar ve Belirticiler
            </h2>
            <div className="pl-9">
              {reportData.diagnoses.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {reportData.diagnoses.map((diag, i) => <li key={i}>{diag}</li>)}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Görüşme sonucunda herhangi bir tanı ölçütü karşılanmadı.</p>
              )}
            </div>
          </section>

          {/* Olası Durumlar Bölümü */}
          {reportData.possibleConditions.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-amber-600 dark:text-amber-400">
                <AlertTriangle className="mr-3 h-6 w-6" /> Değerlendirilmesi Önerilen Olası Durumlar (Modül I Taraması)
              </h2>
              <div className="pl-9">
                <ul className="list-disc list-inside space-y-2">
                  {reportData.possibleConditions.map((cond, i) => <li key={i}>{cond}</li>)}
                </ul>
              </div>
            </section>
          )}

          {/* Notlar Bölümü */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center text-green-600 dark:text-green-400">
              <BookOpen className="mr-3 h-6 w-6" /> Görüşme Notları
            </h2>
            {sessionNote && (
              <div className="mb-6 pl-9">
                <h3 className="font-bold mb-2">Seans Geneli Notlar</h3>
                <p className="whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-700 rounded-md">{sessionNote}</p>
              </div>
            )}
            {reportData.questionNotes.length > 0 && (
              <div className="pl-9">
                <h3 className="font-bold mb-2">Soruya Özel Notlar</h3>
                <div className="space-y-3">
                  {reportData.questionNotes.map(note => (
                    <div key={note.id}>
                      <p className="font-semibold text-gray-600 dark:text-gray-300">Soru ({note.id}): <span className="font-normal italic">"{note.text}"</span></p>
                      <p className="pl-4 border-l-2 ml-2 mt-1">{note.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!sessionNote && reportData.questionNotes.length === 0 && (
              <p className="text-gray-500 italic pl-9">Görüşme sırasında herhangi bir not alınmadı.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};