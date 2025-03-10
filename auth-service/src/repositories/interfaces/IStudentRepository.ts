import { IUser } from "../../models/userModel";
import { IGenericRepository } from "../GenericRepository";

export interface IStudentRepository extends IGenericRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser | null>;
  resetPassword(email: string, password: string): Promise<IUser | null>;
  googleLogin(
    name: string,
    email: string,
    password: string
  ): Promise<IUser | null>;
  updateProfile(email: string, data: IUser): Promise<IUser | null>;
}
