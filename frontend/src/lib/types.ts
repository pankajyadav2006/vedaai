export interface Question {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  options?: string[];
}

export interface Section {
  title: string;
  questionType: string;
  instruction: string;
  questions: Question[];
}

export interface AnswerKeyItem {
  number: number;
  answer: string;
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed: string;
  totalMarks: number;
  sections: Section[];
  answerKey: AnswerKeyItem[];
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  subject: string;
  grade: string;
  dueDate: string;
  additionalInfo?: string;
  fileContent?: string;
  questionTypes: Array<{
    type: string;
    count: number;
    marksEach: number;
  }>;
  totalQuestions: number;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}
