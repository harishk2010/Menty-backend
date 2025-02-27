import { TransactionsResult } from "../../types/types";
import { IInstructor, ITransaction } from "../../models/instructorModel";
import { IGenericRepository } from "../GenericRepository";

export interface IInstructorRepository extends IGenericRepository<IInstructor> {
  getTransactionsList(
    email: string, 
    page: number, 
    limit: number, 
    search?: string
  ): Promise<TransactionsResult | null>;  updatePassword(email: string, password: string): Promise<IInstructor | null>;
}