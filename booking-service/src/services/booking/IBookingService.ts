import { IBooking } from "../../models/bookingModel";
import { NextFunction, Request, Response } from "express";

export default interface IBookingService{
    bookSlot(studentId: string, slotId: string, instructorId: string):Promise<IBooking | null>
    getBookingBySlotId(slotId: string):Promise<IBooking | null>
    getBookingsByStudentId(studentId: string):Promise<IBooking[] | null>
    getBookindDataById(bookingId: string):Promise<IBooking | null>
}