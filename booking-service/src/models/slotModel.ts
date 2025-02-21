import mongoose, { Schema, Document } from "mongoose";

export interface ISlot extends Document {
  instructorId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  price: number;
}

const SlotSchema = new Schema<ISlot>({
  instructorId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
  price: { type: Number, required: true },
});

export const SlotModel = mongoose.model<ISlot>("Slot", SlotSchema);
