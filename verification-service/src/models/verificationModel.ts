import mongoose, { Schema, Document, model, } from "mongoose";

export interface IVerificationModel extends Document{
    username:string,
    email: string,
    resumeUrl: string, 
    degreeCertificateUrl: string, 
    status: string,
    submittedAt: Date,
    reviewedAt: Date,
    comments: string,
}


const verificationRequestSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    resumeUrl: { type: String, required: true }, 
    degreeCertificateUrl: { type: String, required: true }, 
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    comments: { type: String },
  },
  { timestamps: true }
);

const VerificationModel=mongoose.model<IVerificationModel>('VerificationRequests',verificationRequestSchema)

export default VerificationModel