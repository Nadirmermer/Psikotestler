// src/features/scid/components/QuestionRenderer.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ScidQuestion } from '@/features/scid/data/scid5cv.data';

interface QuestionRendererProps {
  question: ScidQuestion;
  currentAnswer?: any;
  onAnswer: (questionId: string, answer: any) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, currentAnswer, onAnswer }) => {
  if (question.type === 'instruction') {
    return <div className="prose prose-lg dark:prose-invert max-w-none"><ReactMarkdown>{question.text}</ReactMarkdown></div>;
  }

  return (
    <div>
      <div className="prose prose-xl dark:prose-invert max-w-none mb-8">
        <ReactMarkdown>{question.text}</ReactMarkdown>
      </div>
      <div className="flex flex-wrap gap-4">
        {question.options?.map(opt => (
          <Button
            key={opt.value}
            onClick={() => onAnswer(question.id, opt.value)}
            variant={currentAnswer === opt.value ? 'default' : 'outline'}
            size="lg"
            className="text-lg"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
};