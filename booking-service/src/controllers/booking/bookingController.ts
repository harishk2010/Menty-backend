import { NextFunction, Request, Response } from "express";
import IBookingController from "../interfaces/IBookingController";
import IBookingService from "../../services/interfaces/IBookingService";

import produce from "../../config/kafka/producer";
import { BookingErrorMessages, BookingSuccessMessages, UserErrorMsg } from "@/utils/constants";
import { StatusCode } from "@/utils/enums";

export class BookingController implements IBookingController {
  private bookingService: IBookingService;
  constructor(bookingService: IBookingService) {
    this.bookingService = bookingService;
  }

  async bookSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this.bookingService.getBookingBySlotId(
        req.body.slotId
      );
      if (response) {
        res.json({ success: false });
        return;
      }
      const instructorShare = req.body.amountPaid * 0.9;
      const adminShare = req.body.amountPaid * 0.1;
      const booking = await this.bookingService.bookSlot(
        req.body.studentId,
        req.body.slotId,
        req.body.instructorId
      );
      if (booking) {
        produce("update-instructor-wallet", {
          instructorId: req.body.instructorId,
          txnid: req.body.txnid,
          amount: instructorShare,
          type: "credit",
          description: `Payment Received for BookingId:${booking._id}`,
        });
        produce("update-admin-wallet", {
          instructorId: req.body.instructorId,
          txnid: req.body.txnid,
          amount: adminShare,
          type: "credit",
          description: `Payment Received for BookingId:${booking._id}`,
        });
        produce("add-booking", booking);
      }
      res
        .status(StatusCode.CREATED)
        .json({ success: true, message: BookingSuccessMessages.SLOT_BOOKED, data: booking });
    } catch (error) {
      throw error;
    }
  }

  async getBookingsByStudentId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { studentId } = req.params;
      if (!studentId) {
        throw new Error("No user found!");
      }

      const response = await this.bookingService.getBookingsByStudentId(
        studentId
      );
      if (response) {
        res.status(StatusCode.OK).json({
          success: true,
          message: BookingSuccessMessages.STUDENT_BOOKINGS_FETCHED,
          data: response,
        });
      }
    } catch (error) {
      throw error;
    }
  }
  async getBookingsByInstructorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { instructorId } = req.params;
      if (!instructorId) {
        throw new Error(UserErrorMsg.NO_USER);
      }

      const response = await this.bookingService.getBookingsByInstructorId(
        instructorId
      );
      if (response) {
        res.status(StatusCode.OK).json({
          success: true,
          message: BookingSuccessMessages.BOOKING_DETAILS_FETCHED,
          data: response,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getBookindDataById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        throw new Error(BookingErrorMessages.BOOKING_NOT_FOUND);
      }

      const response = await this.bookingService.getBookindDataById(bookingId);
      if (response) {
        res.status(StatusCode.OK).json({
          success: true,
          message: BookingSuccessMessages.BOOKING_DETAILS_FETCHED,
          data: response,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
