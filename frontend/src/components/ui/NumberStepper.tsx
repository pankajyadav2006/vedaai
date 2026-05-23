import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <span className="font-bold text-sm w-6 text-center tabular-nums">
        {value}
      </span>
      
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NumberStepper;
