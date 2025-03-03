import { PaginationResult } from "../types/types";
import { IUser } from "../models/userModel";
import { IGenericRepository } from "../repostories/GenericRepository";

export interface IStudentRepository extends IGenericRepository<IUser> {
  searchUsers(query: string,
    role: string,
    page: number,
    limit: number): Promise<PaginationResult<IUser>>
  updatePassword(email: string, password: string): Promise<IUser | null>;
}