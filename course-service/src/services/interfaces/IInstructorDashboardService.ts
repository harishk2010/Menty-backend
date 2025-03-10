import { IUser } from "../../models/userModel";
import { InstructorDashboardData } from "../../Types/updateRequestType";

export interface IInstructorDashboardService {
  getInstructorDashboard(
    instructorId: string
  ): Promise<InstructorDashboardData>;
  updateProfile(
    email: string,
    data: { username: string; profilePicUrl: string }
  ): Promise<IUser | null>;
}
