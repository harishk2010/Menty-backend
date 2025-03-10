import { IInstructorDashboardService } from "../interfaces/IInstructorDashboardService";
import { IInstructorDashboardRepository } from "../../repositories/interfaces/IInstructorDashboardRepository";
import { InstructorDashboardData } from "../../Types/updateRequestType";
import UserModel, { IUser } from "../../models/userModel";

export class InstructorDashboardService implements IInstructorDashboardService {
  private instructorDashboardRepository: IInstructorDashboardRepository;

  constructor(instructorDashboardRepository: IInstructorDashboardRepository) {
    this.instructorDashboardRepository = instructorDashboardRepository;
  }

  async getInstructorDashboard(
    instructorId: string
  ): Promise<InstructorDashboardData> {
    try {
      return await this.instructorDashboardRepository.getInstructorDashboardData(
        instructorId
      );
    } catch (error) {
      throw error;
    }
  }
  async updateProfile(
    email: string,
    data: { username: string; profilePicUrl: string }
  ): Promise<IUser | null> {
    try {
      return await UserModel.findOneAndUpdate({ email }, data);
    } catch (error) {
      throw error;
    }
  }
}
