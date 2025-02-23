import { IUser } from "../../models/userModel";
import { Request, Response } from "express";

export interface IStudentService {
  createStudent(payload: IUser): Promise<IUser | null>;
  getStudentData(email: string): Promise<IUser | null>;
  getStudentDataById(studentId: string): Promise<IUser | null>;
  updateProfile(id: string, data: object): Promise<IUser | null>;
  updatePassword(email: string, password: string): Promise<IUser | null>;
  getStudents(): Promise<IUser[]>;
}