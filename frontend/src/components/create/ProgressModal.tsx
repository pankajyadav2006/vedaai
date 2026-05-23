'use client';

import React from 'react';
import { useJobStore } from '@/stores/jobStore';
import { useJobSocket } from '@/hooks/useJobSocket';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProgressModal = () => {
  const { jobId, status, progress, message, paperId, reset } = useJobStore();
  const router = useRouter();

  useJobSocket(jobId);

  React.useEffect(() => {
    if (status === 'completed' && paperId) {
      setTimeout(() => {
        router.push(`/paper/${paperId}`);
        reset();
      }, 1500);
    }
  }, [status, paperId, router, reset]);

  if (status === 'idle') return null;

  const steps = [
    { label: 'Assignment created', key: 'pending' },
    { label: 'Job queued', key: 'pending' },
    { label: 'Generating questions...', key: 'processing' },
    { label: 'Structuring paper', key: 'processing' },
    { label: 'Finalizing', key: 'completed' },
  ];

  const getStepStatus = (index: number) => {
    if (status === 'failed') return 'error';
    if (status === 'completed') return 'completed';
    
    // Simple logic to map progress to steps
    const currentStepIndex = Math.floor((progress / 100) * steps.length);
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[32px] p-10 w-full max-w-[480px] shadow-2xl">
        <h2 className="text-xl font-bold text-primary mb-6 text-center">
          {status === 'failed' ? 'Generation Failed' : 'Generating your question paper...'}
        </h2>

        {status === 'failed' ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-600 font-medium">{message}</p>
            <button 
              onClick={reset}
              className="cta-button w-full mt-4"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 flex justify-between items-end">
              <span className="text-xs text-secondary italic">{message}</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            
            <div className="h-2 w-full bg-gray-100 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const s = getStepStatus(index);
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border
                      ${s === 'completed' ? 'bg-green-500 border-green-500' : 
                        s === 'current' ? 'border-primary' : 'border-gray-300'}`}
                    >
                      {s === 'completed' ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : s === 'current' ? (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                      ) : null}
                    </div>
                    <span className={`text-sm ${s === 'current' ? 'font-bold text-primary' : 
                      s === 'completed' ? 'text-secondary' : 'text-gray-400'}`}>
                      {s === 'completed' ? '✓ ' : s === 'current' ? '→ ' : '○ '}
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
