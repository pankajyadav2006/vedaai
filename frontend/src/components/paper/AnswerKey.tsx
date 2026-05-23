import React from 'react';

interface Props {
  answers: Array<{ number: number; answer: string }>;
}

const AnswerKey: React.FC<Props> = ({ answers }) => {
  return (
    <div className="mt-16 pt-8 border-t-2 border-primary">
      <h3 className="font-bold text-lg text-primary mb-6">Answer Key:</h3>
      <div className="space-y-4">
        {answers.map((a) => (
          <div key={a.number} className="text-sm leading-[1.8] text-primary">
            <span className="font-bold">{a.number}. </span>
            <span>{a.answer}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerKey;
