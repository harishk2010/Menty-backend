import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ReviewModel = model<IReview>("Review", ReviewSchema);
