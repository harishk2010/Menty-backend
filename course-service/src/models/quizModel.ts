import { Schema, model, Document } from 'mongoose';


interface IQuestions extends Document{
    questionText: string;
  options: string[];
  correctAnswer: string;
}

const QuestionSchema = new Schema<IQuestions>({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

export interface IQuiz extends Document{
  courseId:Schema.Types.ObjectId;
  title:string;
  description:string;
  questions:IQuestions[]
}

const QuizSchema = new Schema<IQuiz>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema], 
  },
  { timestamps: true }
);

export const QuizModel=model<IQuiz>('Quiz',QuizSchema)
