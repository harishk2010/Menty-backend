import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface ITransaction {
  amount: number;
  type: "credit" | "debit";
  description: string;
  txnId:string;
  date: Date;
}

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  mobile: number;
  password: string;
  role?: string;
  profilePicUrl?: string;
  studiedHours: number;
  isVerified: boolean;
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
  date: { type: Date, default: Date.now },
});

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: false },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "student" },
    profilePicUrl: { type: String, required: false, default: "https://freesvg.org/img/abstract-user-flat-4.png" },
    studiedHours: { type: Number, required: false, default: 0 },
    isVerified: { type: Boolean, required: false, default: false },
    isBlocked: { type: Boolean, required: false, default: false },
    wallet: {
      balance: { type: Number, required: false, default: 0 },
      transactions: [TransactionSchema],
      txnId:{type:String,required:false}
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
