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
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: false, default: 'student' },
  profilePicUrl: { type: String, required: false, default: 'No Picture' },
  studiedHours: { type: Number, required: false, default: 0 },
  isVerified: { type: Boolean, required: false, default: false },
  isBlocked: { type: Boolean, required: false, default: false }
},
{
  timestamps: true
}
)

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel