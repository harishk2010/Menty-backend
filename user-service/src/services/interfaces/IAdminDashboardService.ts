import { AdminDashboardData } from "../../types/types";

export interface IAdminDashboardService {
  getDashboardData(): Promise<AdminDashboardData | null>;
}
