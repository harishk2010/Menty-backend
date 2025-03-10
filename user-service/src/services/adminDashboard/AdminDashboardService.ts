import { IAdminDashboardService } from "../interfaces/IAdminDashboardService";
import { IAdminDashboardRepository } from "../../repostories/interfaces/IAdminDashboardRepository";
import { AdminDashboardData } from "../../types/types";

export class AdminDashboardService implements IAdminDashboardService {
  private adminDashboardRepository: IAdminDashboardRepository;

  constructor(adminDashboardRepository: IAdminDashboardRepository) {
    this.adminDashboardRepository = adminDashboardRepository;
  }

  async getDashboardData(): Promise<AdminDashboardData> {
    try {
      const dashboardData =
        await this.adminDashboardRepository.getDashboardData();

      if (!dashboardData) {
        throw new Error("Failed to generate dashboard data");
      }

      return dashboardData;
    } catch (error) {
      console.error("Error in AdminDashboardService.getDashboardData:", error);
      throw new Error("Unable to fetch dashboard data");
    }
  }
}
