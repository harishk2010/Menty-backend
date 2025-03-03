import { InstructorProfile, InstructorStatus } from "../types/types";
import { IInstructor } from "../models/instructorModel";

export default interface IInstructorServices {
  findByEmail(email: string): Promise<IInstructor | null>;
  createUser(userData: IInstructor): Promise<IInstructor | null>;
  resetPassword(email: string, password: string): Promise<IInstructor | null>;
  googleLogin(name: string, email: string, password: string): Promise<IInstructor | null>;
  updateProfile(email: string, data: InstructorProfile | InstructorStatus): Promise<IInstructor | null>;
}