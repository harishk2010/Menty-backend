import { NextFunction, Request, Response } from "express";
import { IAdminDashboardService } from "../../services/interfaces/IAdminDashboardService";
import { IAdminDashboardController } from "../interfaces/IAdminDashboardController";
import getId from "../../utils/getId";

export class AdminDashboardController implements IAdminDashboardController {
  private adminDashboardService: IAdminDashboardService;

  constructor(adminDashboardService: IAdminDashboardService) {
    this.adminDashboardService = adminDashboardService;
  }

  async getDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const adminId = await getId("accessToken", req);
      const dashboardData = await this.adminDashboardService.getDashboardData();

      res.status(200).json({
        success: true,
        message: "Admin dashboard data retrieved successfully",
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
}
