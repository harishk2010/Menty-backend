import { PaginatedMentors, TransactionsResult } from "../../types/types";
import { IInstructor, ITransaction } from "../../models/instructorModel";
import { IGenericRepository } from "../GenericRepository";

export interface IInstructorRepository extends IGenericRepository<IInstructor> {

   getPaginatedMentors(
      page: number, 
      limit: number, 
      search: string, 
      sort: string, 
      expertise: string[]
    ): Promise<PaginatedMentors>
    getMentorExpertise(): Promise<string[]>
  getTransactionsList(
    email: string, 
    page: number, 
    limit: number, 
    search?: string
  ): Promise<TransactionsResult | null>;  updatePassword(email: string, password: string): Promise<IInstructor | null>;
}