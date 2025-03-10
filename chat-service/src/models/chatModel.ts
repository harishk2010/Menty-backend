import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  content: string;
  sender: string;
  senderType: "student" | "instructor";
  bookingId: string;
  createdAt: Date;
  messageType: "text" | "image";
  imageUrl?: string;
}

export interface IChat extends Document {
  bookingId: string;
  studentId: string;
  instructorId: string;
  messages: IMessage[];
}

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    sender: { type: String, required: true },
    senderType: {
      type: String,
      enum: ["student", "instructor"],
      required: true,
    },
    bookingId: { type: String, required: true },
    messageType: { type: String, enum: ["text", "image"], default: "text" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const ChatSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    instructorId: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
