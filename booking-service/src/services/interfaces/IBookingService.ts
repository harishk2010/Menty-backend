import { IBooking } from "../../models/bookingModel";

export default interface IBookingService {
  bookSlot(
    studentId: string,
    slotId: string,
    instructorId: string
  ): Promise<IBooking | null>;
  getBookingBySlotId(slotId: string): Promise<IBooking | null>;
  getBookingsByStudentId(studentId: string): Promise<IBooking[] | null>;
  getBookingsByInstructorId(instructorId: string): Promise<IBooking[] | null>;
  getBookindDataById(bookingId: string): Promise<IBooking | null>;
}
