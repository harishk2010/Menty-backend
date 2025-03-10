import { PaginationResult, SearchOptions } from "../../types/types";
import { IUser } from "../../models/userModel";

export interface IStudentService {
  createStudent(payload: IUser): Promise<IUser | null>;
  getStudentData(email: string): Promise<IUser | null>;
  getStudentDataById(studentId: string): Promise<IUser | null>;
  searchStudents(
    query: string,
    role: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    data: IUser[];
    pagination: PaginationResult<IUser>["pagination"];
  }>;
  updateProfile(id: string, data: object): Promise<IUser | null>;
  updatePassword(email: string, password: string): Promise<IUser | null>;
  getStudents(): Promise<IUser[]>;
}
