import mongoose, { Schema, Document, model } from "mongoose";
import { ObjectId } from "mongodb";

export interface IInstructorDTO {
  username: string;
  email: string;
  password: string;
}
export interface IInstructor extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  mobile: string;
  profilePicUrl?: string;
  role: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  isMentor: Boolean;
  memberShipValidTill: Date;

  txnId: string;
}

const InstructorSchema: Schema<IInstructor> = new Schema(
  {
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: false },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["instructor", "mentor"],
      required: false,
      default: "instructor",
    },
    profilePicUrl: {
      type: String,
      required: false,
      default: "https://freesvg.org/img/abstract-user-flat-4.png",
    },
    isVerified: { type: Boolean, required: false, default: false },
    isBlocked: { type: Boolean, required: false, default: false },

    isMentor: { type: Boolean, default: false },
    memberShipValidTill: { type: Date, required: false },
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
