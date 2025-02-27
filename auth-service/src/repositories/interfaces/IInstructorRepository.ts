import { IInstructor } from "../../models/instructorModel";
import { IGenericRepository } from "../GenericRepository";

export interface IInstructorRepository extends IGenericRepository<IInstructor> {
  findByEmail(email: string): Promise<IInstructor | null>;
  createUser(userData: IInstructor): Promise<IInstructor | null>;
  resetPassword(email: string, password: string): Promise<IInstructor | null>;
  googleLogin(name: string, email: string, password: string): Promise<IInstructor | null>;
  updateProfile(email: string, data: {username:string, profilePicUrl:string}): Promise<IInstructor | null>;
}