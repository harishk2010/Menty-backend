import { Schema, model, Document } from 'mongoose';

interface ICompletedChapter {
  chapterId: Schema.Types.ObjectId;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface IPurchasedCourse extends Document {
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  instructorId: Schema.Types.ObjectId;
  completedChapters: ICompletedChapter[];
  isCourseCompleted: boolean;
  transactionId: string;
  price: number;
  purchasedAt: Date;
  completedAt?: Date;
  quizId:Schema.Types.ObjectId;
}

const CompletedChapterSchema = new Schema<ICompletedChapter>({
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const PurchasedCourseSchema = new Schema<IPurchasedCourse>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'Instructors', required: true },
    completedChapters: [CompletedChapterSchema],
    isCourseCompleted: { type: Boolean, default: false },
    transactionId: { type: String},
    price: { type: Number},
    purchasedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    quizId:{type:Schema.Types.ObjectId,ref:'Quiz',required:true}
  },
  { timestamps: true }
);

export const PurchasedCourseModel = model<IPurchasedCourse>(
  'PurchasedCourse',
  PurchasedCourseSchema
);