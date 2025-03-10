import { NextFunction, Request, Response } from "express";

export default interface IBookingController {
  bookSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBookingsByStudentId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getBookingsByInstructorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getBookindDataById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
