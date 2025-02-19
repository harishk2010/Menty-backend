import { IUser } from "../../models/userModel";
import { IGenericRepository } from "../GenericRepository";

export interface IStudentRepository extends IGenericRepository<IUser> {
  updatePassword(email: string, password: string): Promise<IUser | null>;
}