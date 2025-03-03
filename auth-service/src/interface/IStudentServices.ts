import { StudentProfile, StudentStatus } from "../types/types";
import { IUser } from "../models/userModel";



export  default interface IStudentServices {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser | null>;
  resetPassword(email: string, password: string): Promise<IUser | null>;
  googleLogin(name: string, email: string, password: string): Promise<IUser | null>;
  updateProfile(email: string, data: StudentProfile| StudentStatus): Promise<IUser | null>;
}