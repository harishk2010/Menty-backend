import mongoose, { Schema, Document, model, } from "mongoose";
import { ObjectId } from "mongodb";

export interface IInstructor extends Document {
    _id: ObjectId,
    username: string,
    email: string,
    password: string,
    phone: string,
    expertise: string,
    skills: string,
    profilePicUrl?: string,
    role: string,
    isVerified?: boolean,
    isBlocked?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

const InstructorSchema: Schema<IInstructor> = new Schema({
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  expertise: { type: String, required: false },
  skills: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, required: false, default: null },
  profilePicUrl: { type: String, required: false, default: 'img not provided' },
  isVerified: { type: Boolean, required: false, default: false },
  isBlocked: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},
{
  timestamps: true
}
)

const InstructorModel = mongoose.model<IInstructor>('Instructors', InstructorSchema)

export default InstructorModel