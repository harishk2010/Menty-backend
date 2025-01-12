import mongoose, { Schema, Document, model, } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
  _id: ObjectId,
  username: string,
  email: string,
  phone: string,
  password: string,
  role?: string,
  profilePicUrl?: string,
  studiedHours: number,
  isVerified: boolean,
  isBlocked: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicUrl: { type: String, required: true, default: 'No Picture' },
  studiedHours: { type: Number, required: true, default: 0 },
  isVerified: { type: Boolean, required: true, default: false },
  isBlocked: { type: Boolean, required: true, default: false }
},
{
  timestamps: true
}
)

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel