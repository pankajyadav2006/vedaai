import { create } from 'zustand';

export interface QuestionTypeRow {
  id: string;
  type: string;
  count: number;
  marksEach: number;
}

interface AssignmentStore {
  currentStep: number;
  formData: {
    file: File | null;
    dueDate: string;
    questionTypes: QuestionTypeRow[];
    additionalInfo: string;
  };
  setStep: (n: number) => void;
  updateFormData: (data: Partial<AssignmentStore['formData']>) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (id: string, field: keyof QuestionTypeRow, value: any) => void;
  resetForm: () => void;
}

const defaultQuestionTypes: QuestionTypeRow[] = [
  { id: '1', type: 'Multiple Choice Questions', count: 10, marksEach: 1 },
  { id: '2', type: 'Short Questions', count: 5, marksEach: 2 },
  { id: '3', type: 'Diagram/Graph-Based Questions', count: 2, marksEach: 5 },
  { id: '4', type: 'Numerical Problems', count: 3, marksEach: 4 },
];

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  currentStep: 1,
  formData: {
    file: null,
    dueDate: '',
    questionTypes: defaultQuestionTypes,
    additionalInfo: '',
  },
  setStep: (n) => set({ currentStep: n }),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  addQuestionType: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: [
          ...state.formData.questionTypes,
          { id: Math.random().toString(36).substr(2, 9), type: 'Short Questions', count: 1, marksEach: 1 },
        ],
      },
    })),
  removeQuestionType: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.filter((q) => q.id !== id),
      },
    })),
  updateQuestionType: (id, field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.map((q) =>
          q.id === id ? { ...q, [field]: value } : q
        ),
      },
    })),
  resetForm: () =>
    set({
      currentStep: 1,
      formData: {
        file: null,
        dueDate: '',
        questionTypes: defaultQuestionTypes,
        additionalInfo: '',
      },
    }),
}));
