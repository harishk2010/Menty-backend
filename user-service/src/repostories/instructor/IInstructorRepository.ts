import { IInstructor, ITransaction } from "../../models/instructorModel";
import { IGenericRepository } from "../GenericRepository";

export interface IInstructorRepository extends IGenericRepository<IInstructor> {
  getTransactionsList(email: string, currentPage: number, itemsPerPage: number): Promise<ITransaction[] | null>;
  updatePassword(email: string, password: string): Promise<IInstructor | null>;
}