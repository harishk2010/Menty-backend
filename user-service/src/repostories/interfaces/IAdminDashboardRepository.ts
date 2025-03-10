import { AdminDashboardData } from "../../types/types";

export interface IAdminDashboardRepository {
  getDashboardData(): Promise<AdminDashboardData | null>;
  getStudentCount(): Promise<{ total: number; newThisMonth: number }>;
  getInstructorCount(): Promise<{
    total: number;
    newThisMonth: number;
    topEarners: number;
  }>;
  getTotalRevenue(): Promise<number>;
  getPendingInstructorApplications(): Promise<number>;
  getMonthlyRevenue(): Promise<{ name: string; value: number }[]>;
  getTopInstructors(limit?: number): Promise<any[]>;
  getRecentStudents(limit?: number): Promise<any[]>;
}
