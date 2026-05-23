'use client';

import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useAssignmentStore, QuestionTypeRow as IRow } from '@/stores/assignmentStore';
import NumberStepper from '@/components/ui/NumberStepper';

const questionTypes = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False',
  'Fill in the Blanks'
];

interface Props {
  row: IRow;
}

const QuestionTypeRow: React.FC<Props> = ({ row }) => {
  const { updateQuestionType, removeQuestionType } = useAssignmentStore();

  return (
    <div className="bg-white border border-border rounded-xl p-3 flex flex-col md:flex-row md:items-center gap-4">
      {/* Dropdown */}
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <select 
            value={row.type}
            onChange={(e) => updateQuestionType(row.id, 'type', e.target.value)}
            className="w-full appearance-none bg-transparent font-bold text-sm pr-10 focus:outline-none"
          >
            {questionTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
        </div>
        <button 
          onClick={() => removeQuestionType(row.id)}
          className="p-1 hover:bg-gray-100 rounded-lg text-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-8">
        {/* Count Stepper */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-secondary font-medium whitespace-nowrap">No. of Questions</span>
          <NumberStepper 
            value={row.count} 
            onChange={(val) => updateQuestionType(row.id, 'count', val)}
            min={1}
            max={50}
          />
        </div>

        {/* Marks Stepper */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-secondary font-medium whitespace-nowrap">Marks</span>
          <NumberStepper 
            value={row.marksEach} 
            onChange={(val) => updateQuestionType(row.id, 'marksEach', val)}
            min={1}
            max={20}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionTypeRow;
