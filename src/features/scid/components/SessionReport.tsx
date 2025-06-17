// src/features/scid/components/SessionReport.tsx

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ClipboardList, BookOpen, AlertTriangle, List } from 'lucide-react';
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
    const allAnsweredQuestions: { id: string; question: string; answer: string; note?: string; module: string }[] = [];

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

      // 4. Tüm cevaplanmış sorular
      if (answerData) {
        let answerText = '';
        if (answerData.answer === '+') answerText = 'Pozitif (+)';
        else if (answerData.answer === '-') answerText = 'Negatif (-)';
        else if (answerData.answer === 'EVET') answerText = 'Evet';
        else if (answerData.answer === 'HAYIR') answerText = 'Hayır';
        else answerText = answerData.answer?.toString() || 'Cevapsız';

        allAnsweredQuestions.push({
          id: question.id,
          question: question.text.substring(0, 100) + (question.text.length > 100 ? '...' : ''),
          answer: answerText,
          note: answerData.note,
          module: question.module || 'Genel'
        });
      }
    }

    return { 
      diagnoses, 
      possibleConditions, 
      questionNotes, 
      allAnsweredQuestions: allAnsweredQuestions.sort((a, b) => {
        if (a.module === b.module) {
          return a.id.localeCompare(b.id);
        }
        return a.module.localeCompare(b.module);
      })
    };
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Toplam Cevaplanan Soru:</span> {reportData.allAnsweredQuestions.length}
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

            {/* Detaylı Soru-Cevap Listesi */}
            <section className="bg-gradient-to-br from-gray-50/50 to-slate-50/30 dark:from-gray-900/20 dark:to-slate-900/10 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-700 dark:text-gray-300">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <List className="h-5 w-5 text-white" />
                </div>
                Detaylı Soru-Cevap Listesi ({reportData.allAnsweredQuestions.length} soru)
              </h2>
              <div className="ml-13">
                {reportData.allAnsweredQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {reportData.allAnsweredQuestions.map((item, index) => (
                      <div key={item.id} className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-mono">
                                {item.id}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                                Modül {item.module}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span className="font-medium">Soru:</span> {item.question}
                            </p>
                          </div>
                          <div className="ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.answer.includes('Pozitif') ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                              item.answer.includes('Negatif') ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                              item.answer.includes('Evet') ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' :
                              item.answer.includes('Hayır') ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                              {item.answer}
                            </span>
                          </div>
                        </div>
                        {item.note && (
                          <div className="mt-2 pl-4 border-l-2 border-blue-300 dark:border-blue-600">
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              <span className="font-medium text-blue-600 dark:text-blue-400">Not:</span> {item.note}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    Hiçbir soru cevaplanmadı.
                  </p>
                )}
              </div>
            </section>

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
                  <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200">Soruya Özel Notlar ({reportData.questionNotes.length} adet)</h3>
                  <div className="space-y-4">
                    {reportData.questionNotes.map(note => (
                      <div key={note.id} className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded text-xs font-mono mr-2">
                            {note.id}
                          </span>
                          <span className="font-normal italic text-gray-600 dark:text-gray-400">"{note.text}"</span>
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