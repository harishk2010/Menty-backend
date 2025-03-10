import { InstructorDashboardData } from "../../Types/updateRequestType";

export interface IInstructorDashboardRepository {
  getInstructorDashboardData(
    instructorId: string
  ): Promise<InstructorDashboardData>;
  getCourseAnalytics(instructorId: string): Promise<any>;
  getRevenueStats(instructorId: string): Promise<any>;
  getStudentGrowth(instructorId: string): Promise<any>;
  getCoursePerformance(instructorId: string): Promise<any>;
  getUpcomingAppointments(instructorId: string): Promise<any>;
}
