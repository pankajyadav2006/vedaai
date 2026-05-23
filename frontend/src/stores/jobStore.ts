import { create } from 'zustand';

interface JobStore {
  jobId: string | null;
  status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  paperId: string | null;
  setJob: (jobId: string) => void;
  updateProgress: (percent: number, message: string) => void;
  setComplete: (paperId: string) => void;
  setFailed: (message: string) => void;
  reset: () => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobId: null,
  status: 'idle',
  progress: 0,
  message: '',
  paperId: null,
  setJob: (jobId) => set({ jobId, status: 'pending', progress: 0, message: 'Job queued...' }),
  updateProgress: (percent, message) => set({ progress: percent, message, status: 'processing' }),
  setComplete: (paperId) => set({ paperId, status: 'completed', progress: 100, message: 'Generation complete!' }),
  setFailed: (message) => set({ status: 'failed', message }),
  reset: () => set({ jobId: null, status: 'idle', progress: 0, message: '', paperId: null }),
}));
