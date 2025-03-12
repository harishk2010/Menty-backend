import { IAdminDashboardService } from "../interfaces/IAdminDashboardService";
import { IAdminDashboardRepository } from "../../repostories/interfaces/IAdminDashboardRepository";
import { AdminDashboardData } from "../../types/types";

export class AdminDashboardService implements IAdminDashboardService {
  private adminDashboardRepository: IAdminDashboardRepository;

  constructor(adminDashboardRepository: IAdminDashboardRepository) {
    this.adminDashboardRepository = adminDashboardRepository;
  }

  async getDashboardData(): Promise<AdminDashboardData | null> {
      return this.adminDashboardRepository.getDashboardData();
    
  }
}
