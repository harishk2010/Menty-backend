import { NextFunction, Request, Response } from "express";

export interface IInstructorDashboardController {
  getInstructorDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateProfile(data: {
    email: string;
    username: string;
    profilePicUrl: string;
  }): Promise<void>;
}
