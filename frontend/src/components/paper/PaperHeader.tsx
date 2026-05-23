import React from 'react';

interface Props {
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed: string;
  totalMarks: number;
}

const PaperHeader: React.FC<Props> = ({ schoolName, subject, grade, timeAllowed, totalMarks }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-primary">{schoolName}</h1>
        <p className="text-base text-primary">Subject: {subject}</p>
        <p className="text-base text-primary">Class: {grade}th</p>
      </div>

      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mt-6">
        <span className="text-sm font-semibold text-primary">Time Allowed: {timeAllowed}</span>
        <span className="text-sm font-semibold text-primary">Maximum Marks: {totalMarks}</span>
      </div>

      <div className="text-left">
        <p className="text-sm italic text-primary">General Instruction: All questions are compulsory unless stated otherwise.</p>
      </div>

      <div className="text-left space-y-3 mt-6 text-sm">
        <p>Name: ___________________</p>
        <p>Roll Number: _______________</p>
        <div className="flex gap-8">
          <span>Class: {grade}th</span>
          <span>Section: ________</span>
        </div>
      </div>
    </div>
  );
};

export default PaperHeader;
