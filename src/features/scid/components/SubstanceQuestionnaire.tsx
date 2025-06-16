// src/features/scid/components/SubstanceQuestionnaire.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScidQuestion } from '@/features/scid/data/scid5cv.data';

interface SubstanceQuestionnaireProps {
  questionnaire: ScidQuestion;
  substanceName: string;
  onComplete: (answers: { [key: string]: string }) => void;
}

export const SubstanceQuestionnaire: React.FC<SubstanceQuestionnaireProps> = ({ questionnaire, substanceName, onComplete }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const allQuestionsAnswered = questionnaire.sub_questions?.length === Object.keys(answers).length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-700 rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          <span className="text-blue-500">{substanceName}</span> Kullanım Bozukluğu Değerlendirmesi
        </h1>
        <div className="space-y-6 mt-8">
          {questionnaire.sub_questions?.map(subQ => (
            <div key={subQ.id} className="p-4 border-l-4 border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{subQ.text.replace(/\(MADDE\)/g, substanceName)}</p>
              <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">{subQ.criteria}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAnswer(subQ.id, '+')}
                  variant={answers[subQ.id] === '+' ? 'default' : 'outline'}
                >
                  Evet
                </Button>
                <Button
                  onClick={() => handleAnswer(subQ.id, '-')}
                  variant={answers[subQ.id] === '-' ? 'destructive' : 'outline'}
                >
                  Hayır
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button size="lg" disabled={!allQuestionsAnswered} onClick={() => onComplete(answers)}>
            Anketi Tamamla ve Devam Et
          </Button>
        </div>
      </div>
    </div>
  );
};