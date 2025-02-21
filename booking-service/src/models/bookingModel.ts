import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  studentId: string;
  slotId: string;
  instructorId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  studentId: { type: String, required: true },
  slotId: { type: String, required: true },
  instructorId: { type: String, required: true },
  status: { type: String, enum: [ "confirmed", "cancelled"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
