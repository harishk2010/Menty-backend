import mongoose, { Schema, Document, model } from "mongoose";
import { ObjectId } from "mongodb";

export interface IInstructor extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  mobile: string;
  expertise: string;
  skills: string;
  profilePicUrl?: string;
  role: string;
  verificationStatus: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const InstructorSchema: Schema<IInstructor> = new Schema(
  {
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: false },
    expertise: { type: String, required: false },
    skills: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "instructor" },
    profilePicUrl: {
      type: String,
      required: false,
      default: "img not provided",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default:"pending"
    },
    isVerified: { type: Boolean, required: false, default: false },
    isBlocked: { type: Boolean, required: false, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const InstructorModel = mongoose.model<IInstructor>(
  "Instructors",
  InstructorSchema
);

export default InstructorModel;
