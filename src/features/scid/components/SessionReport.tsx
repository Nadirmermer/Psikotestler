// src/features/scid/components/SessionReport.tsx

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ClipboardList, BookOpen, AlertTriangle } from 'lucide-react';
import { ScidQuestion } from '../data/scid5cv.data';
import { ScidTestHeader } from './ScidTestHeader';

// Gerekli prop tiplerini tanımlayalım
interface SessionReportProps {
  answers: { [key: string]: { answer: any; note?: string } };
  allQuestions: ScidQuestion[];
  sessionNote?: string;
  clientName: string;
  sessionDate: string;
  onBack?: () => void;
  onExit?: () => void;
}

export const SessionReport: React.FC<SessionReportProps> = ({
  answers,
  allQuestions,
  sessionNote,
  clientName,
  sessionDate,
  onBack,
  onExit
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 print:bg-white">
      
      {/* Header */}
      <div className="print:hidden">
        <ScidTestHeader
          title="SCID-5-CV Görüşme Raporu"
          subtitle={`${clientName} - ${new Date(sessionDate).toLocaleDateString('tr-TR')}`}
          onBack={onBack}
          onExit={onExit}
          backButtonText="Teste Geri Dön"
          showExitButton={true}
        />
      </div>

      {/* Ana İçerik */}
      <div className="max-w-5xl mx-auto p-6 pt-8 print:p-0">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 print:shadow-none print:rounded-none print:bg-white print:border-0">
          
          {/* Rapor Başlığı */}
          <header className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">SCID-5-CV Görüşme Raporu</h1>
              <div className="space-y-1">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Danışan:</span> {clientName}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Tarih:</span> {new Date(sessionDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
            <Button 
              onClick={handlePrint} 
              className="print:hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Printer className="mr-2 h-4 w-4" /> 
              Yazdır
            </Button>
          </header>

          <main className="space-y-8">
            {/* Saptanan Tanılar Bölümü */}
            <section className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
              <h2 className="text-xl font-bold mb-4 flex items-center text-blue-700 dark:text-blue-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <ClipboardList className="h-5 w-5 text-white" />
                </div>
                Algoritmaya Göre Saptanan Tanılar ve Belirticiler
              </h2>
              <div className="ml-13">
                {reportData.diagnoses.length > 0 ? (
                  <ul className="space-y-2">
                    {reportData.diagnoses.map((diag, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-200">{diag}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    Görüşme sonucunda herhangi bir tanı ölçütü karşılanmadı.
                  </p>
                )}
              </div>
            </section>

            {/* Olası Durumlar Bölümü */}
            {reportData.possibleConditions.length > 0 && (
              <section className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 rounded-2xl p-6 border border-amber-200/30 dark:border-amber-700/30">
                <h2 className="text-xl font-bold mb-4 flex items-center text-amber-700 dark:text-amber-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  Değerlendirilmesi Önerilen Olası Durumlar (Modül I Taraması)
                </h2>
                <div className="ml-13">
                  <ul className="space-y-2">
                    {reportData.possibleConditions.map((cond, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-200">{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Notlar Bölümü */}
            <section className="bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-900/20 dark:to-green-900/10 rounded-2xl p-6 border border-emerald-200/30 dark:border-emerald-700/30">
              <h2 className="text-xl font-bold mb-4 flex items-center text-emerald-700 dark:text-emerald-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Görüşme Notları
              </h2>
              
              {sessionNote && (
                <div className="mb-6 ml-13">
                  <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200">Seans Geneli Notlar</h3>
                  <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-relaxed">{sessionNote}</p>
                  </div>
                </div>
              )}
              
              {reportData.questionNotes.length > 0 && (
                <div className="ml-13">
                  <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200">Soruya Özel Notlar</h3>
                  <div className="space-y-4">
                    {reportData.questionNotes.map(note => (
                      <div key={note.id} className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Soru ({note.id}): <span className="font-normal italic text-gray-600 dark:text-gray-400">"{note.text}"</span>
                        </p>
                        <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-600">
                          <p className="text-gray-700 dark:text-gray-200">{note.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!sessionNote && reportData.questionNotes.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 italic ml-13">
                  Görüşme sırasında herhangi bir not alınmadı.
                </p>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};