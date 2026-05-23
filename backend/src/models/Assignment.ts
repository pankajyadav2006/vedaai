import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionType {
  type: string;
  count: number;
  marksEach: number;
}

export interface IAssignment extends Document {
  subject: string;
  grade: string;
  dueDate: Date;
  additionalInfo?: string;
  fileContent?: string;
  questionTypes: IQuestionType[];
  totalQuestions: number;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    dueDate: { type: Date, required: true },
    additionalInfo: { type: String },
    fileContent: { type: String },
    questionTypes: [
      {
        type: { type: String, required: true },
        count: { type: Number, required: true },
        marksEach: { type: Number, required: true },
      },
    ],
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
