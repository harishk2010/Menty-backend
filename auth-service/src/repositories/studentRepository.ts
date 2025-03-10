import UserModel, { IStudentDTO } from "../models/userModel";
import { IUser } from "../models/userModel";
import { GenericRepository } from "./GenericRepository";
import { IStudentRepository } from "./interfaces/IStudentRepository";

export class StudentRepository
  extends GenericRepository<IUser>
  implements IStudentRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email });
  }

  async createUser(userData: IStudentDTO): Promise<IUser | null> {
    return await this.create(userData);
  }

  async resetPassword(email: string, password: string): Promise<IUser | null> {
    try {
      const student = await this.findOne({ email });
      if (!student) {
        throw new Error("No Student data found");
      }
      const studentId = student._id as unknown as string;

      const response = await this.update(studentId, { password });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async googleLogin(
    name: string,
    email: string,
    password: string
  ): Promise<IUser | null> {
    const user = await this.findByEmail(email);
    const username = name;

    if (!user) {
      const newUser = await this.createUser({ username, email, password });
      return newUser;
    }

    return user;
  }

  async updateProfile(email: string, data: IUser): Promise<IUser | null> {
    try {
      const student = await this.findOne({ email });
      if (!student) {
        throw new Error("No Student data found");
      }
      const studentId = student._id as unknown as string;

      const response = await this.update(studentId, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
