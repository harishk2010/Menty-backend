import { IInstructor, ITransaction } from "../../models/instructorModel";

export interface IInstructorService {
  createInstructor(payload: object): Promise<IInstructor | null>;
  getInstructorData(email: string): Promise<IInstructor | null>;
  getInstructorDataById(instructorId: string): Promise<IInstructor | null>;
  updateProfile(id: string, data: object): Promise<IInstructor | null>;
  getTransactionsList(email: string, currentPage: number, itemsPerPage: number): Promise<ITransaction[] | null>;
  updatePassword(email: string, password: string): Promise<IInstructor | null>;
  getInstructors(): Promise<IInstructor[] | null>;
}