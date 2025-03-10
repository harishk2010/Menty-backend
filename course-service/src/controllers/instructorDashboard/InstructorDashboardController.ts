import { NextFunction, Request, Response } from "express";
import { IInstructorDashboardService } from "../../services/interfaces/IInstructorDashboardService";
import { IInstructorDashboardController } from "../interfaces/IInstructorDashboardController";
import getId from "../../utils/getId";
import { IUser } from "../../models/userModel";

export class InstructorDashboardController
  implements IInstructorDashboardController
{
  private instructorDashboardService: IInstructorDashboardService;

  constructor(instructorDashboardService: IInstructorDashboardService) {
    this.instructorDashboardService = instructorDashboardService;
  }

  async getInstructorDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const instructorId = await getId("accessToken", req);

      const dashboardData =
        await this.instructorDashboardService.getInstructorDashboard(
          String(instructorId)
        );

      res.status(200).json({
        success: true,
        message: "Instructor dashboard data retrieved successfully",
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(data: {
    email: string;
    username: string;
    profilePicUrl: string;
  }): Promise<void> {
    try {
      const { email, username, profilePicUrl } = data;
      const response = await this.instructorDashboardService.updateProfile(
        email,
        { username, profilePicUrl }
      );
    } catch (error) {
      throw error;
    }
  }
}
