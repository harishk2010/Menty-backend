import { NextFunction, Request, Response } from "express";
import { IAdminDashboardService } from "../../services/interfaces/IAdminDashboardService";
import { IAdminDashboardController } from "../interfaces/IAdminDashboardController";
import getId from "../../utils/getId";
import { AdminboardResponses } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";

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

      res.status(StatusCode.OK).json({
        success: true,
        message: AdminboardResponses.DASHBOARD_DATA_FETCHED,
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
}
