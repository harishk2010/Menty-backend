import mongoose, { Document, Schema } from "mongoose";

export interface IMentorReview extends Document {
  mentorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorReviewSchema = new Schema<IMentorReview>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Instructors",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
      default: "",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
    },
  },
  {
    timestamps: true,
  }
);

export const MentorReviewModel = mongoose.model<IMentorReview>(
  "MentorReview",
  MentorReviewSchema
);
