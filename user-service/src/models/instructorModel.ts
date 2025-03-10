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
  rating: number;
  verificationStatus: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  planPrice?: number;
  wallet: {
    balance: number;
    transactions: ITransaction[];
  };
}
export interface ITransaction {
  amount: number;
  type: "credit" | "debit";
  txnid: string;
  description: string;
  date: Date;
}
const TransactionSchema: Schema<ITransaction> = new Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  txnid: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const InstructorSchema: Schema<IInstructor> = new Schema(
  {
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: false },
    expertise: { type: String, required: false },
    skills: { type: String, required: false },
    rating: { type: Number, required: false },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "instructor" },
    planPrice: { type: Number, required: false, default: 100 },
    profilePicUrl: {
      type: String,
      required: false,
      default: "https://freesvg.org/img/abstract-user-flat-4.png",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    isVerified: { type: Boolean, required: false, default: false },
    isBlocked: { type: Boolean, required: false, default: false },
    wallet: {
      balance: { type: Number, required: true, default: 0 },
      transactions: [TransactionSchema],
      txnid: { type: String, required: false },
    },
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
