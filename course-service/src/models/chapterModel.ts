import mongoose, { Schema,Types, model, Document } from 'mongoose';

export interface IChapter extends Document {
    chapterTitle: string;
    courseId: Types.ObjectId; // Specify it as ObjectId
    chapterNumber?: number; // Make optional
    description: string;
    videoUrl: string;
    createdAt?: Date;
    // quizId: string;
    // isCompleted: boolean;
}
export interface CreateChapterDTO {
    chapterTitle: string;
    courseId: Types.ObjectId;
    description: string;
    videoUrl: string;
    chapterNumber?: number; // Optional
}

const ChapterSchema = new Schema<IChapter>({
    chapterTitle: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // Corrected to ObjectId
    chapterNumber: { type: Number },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    // quizId: { type: String },
    // isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export const ChapterModel = model<IChapter>('Chapter', ChapterSchema);