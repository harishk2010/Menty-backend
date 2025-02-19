import { IUser } from "../../models/userModel";
import { GenericRepository } from "../GenericRepository";
import UserModel from "../../models/userModel";
import { IStudentRepository } from "./IStudentRepository";

export class StudentRepository extends GenericRepository<IUser> implements IStudentRepository {
  constructor() {
    super(UserModel);
  }

  /**
   * Update a student's password by email.
   * @param email - Email of the student.
   * @param password - New password.
   * @returns The updated student data.
   */
  async updatePassword(email: string, password: string): Promise<IUser | null> {
    try {
      const response = await UserModel.findOneAndUpdate(
        { email },
        { $set: { password } },
        { new: true }
      );
      return response;
    } catch (error) {
      console.error("Error in updatePassword:", error);
      throw error;
    }
  }
}