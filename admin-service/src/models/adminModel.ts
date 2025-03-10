import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IAdminDTO {
  email: string;
  password: string;
}

export interface ITransaction {
  amount: number;
  type: "credit" | "debit";
  description: string;
  txnid:string;
  date: Date;
}

export interface IAdmin extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  role: string;
  profilePicUrl?: string;
  isBlocked: boolean;
  wallet: {
    balance: number;
    transactions: ITransaction[];
  };
}


const TransactionSchema: Schema<ITransaction> = new Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String, required: true },
  txnid: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "admin" },
    profilePicUrl: { type: String, required: false, default: "https://freesvg.org/img/abstract-user-flat-4.png" },
    wallet: {
      balance: { type: Number, required: false, default: 0 },
      transactions: [TransactionSchema],
    },
  },
  {
    timestamps: true,
  }
);

const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);

export default AdminModel;