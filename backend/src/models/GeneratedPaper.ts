import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  options?: string[];
}

export interface ISection {
  title: string;
  questionType: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAnswerKey {
  number: number;
  answer: string;
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed: string;
  totalMarks: number;
  sections: ISection[];
  answerKey: IAnswerKey[];
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedPaperSchema: Schema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    sections: [
      {
        title: { type: String, required: true },
        questionType: { type: String, required: true },
        instruction: { type: String, required: true },
        questions: [
          {
            number: { type: Number, required: true },
            text: { type: String, required: true },
            difficulty: {
              type: String,
              enum: ['Easy', 'Moderate', 'Challenging'],
              required: true,
            },
            marks: { type: Number, required: true },
            options: [{ type: String }],
          },
        ],
      },
    ],
    answerKey: [
      {
        number: { type: Number, required: true },
        answer: { type: String, required: true },
      },
    ],
    pdfUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
