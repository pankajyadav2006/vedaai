import { create } from 'zustand';
import { GeneratedPaper } from '@/lib/types';

interface PaperStore {
  papers: Record<string, GeneratedPaper>;
  setPaper: (id: string, paper: GeneratedPaper) => void;
}

export const usePaperStore = create<PaperStore>((set) => ({
  papers: {},
  setPaper: (id, paper) =>
    set((state) => ({
      papers: { ...state.papers, [id]: paper },
    })),
}));
