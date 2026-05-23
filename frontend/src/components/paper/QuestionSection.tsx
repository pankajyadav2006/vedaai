import React from 'react';

interface Question {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  options?: string[];
}

interface Props {
  sectionTitle: string;
  questionType: string;
  instruction: string;
  questions: Question[];
}

const QuestionSection: React.FC<Props> = ({ sectionTitle, questionType, instruction, questions }) => {
  return (
    <div className="mt-10">
      <div className="text-center mb-6">
        <h2 className="text-base font-bold text-primary">{sectionTitle}</h2>
      </div>
      
      <div className="mb-4">
        <h3 className="font-bold text-primary text-base text-left">{questionType}</h3>
        <p className="text-sm italic text-gray-500 text-left">{instruction}</p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.number} className="text-[15px] leading-[1.8] text-primary">
            <div className="flex gap-2">
              <span className="font-medium">{q.number}.</span>
              <div className="flex-1">
                <span>[{q.difficulty}] {q.text} [{q.marks} Marks]</span>
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2 ml-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="font-medium">({String.fromCharCode(97 + i)})</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;
