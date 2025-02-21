import { ISlot } from "../../models/slotModel";

export default interface ISlotService {
  createRecurringSlots(
    instructorId: string,
    startDate: string,
    endDate: string,
    days: number[],
    startTime: string,
    endTime: string,
    price: number
  ): Promise<ISlot>;
  getInstructorSlots(
    instructorId: string,
  ): Promise<ISlot[]>;
  deleteSlot(
    slotId: string,
  ): Promise<ISlot | null>;
  getSlotById(
    slotId: string,
  ): Promise<ISlot | null>;
}
