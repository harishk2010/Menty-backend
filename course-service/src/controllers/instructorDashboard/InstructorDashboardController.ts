import { NextFunction, Request, Response } from "express";
import { IInstructorDashboardService } from "../../services/interfaces/IInstructorDashboardService";
import { IInstructorDashboardController } from "../interfaces/IInstructorDashboardController";
import getId from "../../utils/getId";
import { IUser } from "../../models/userModel";
import { InstructorDashboardResponses } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";

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

      res.status(StatusCode.OK).json({
        success: true,
        message: InstructorDashboardResponses.DASHBOARD_DATA_FETCHED,
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
