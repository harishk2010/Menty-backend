import { PaginatedMentors, TransactionsResult } from "../../types/types";
import { IInstructor, ITransaction } from "../../models/instructorModel";

export interface IInstructorService {
  createInstructor(payload: object): Promise<IInstructor | null>;
  getInstructorData(email: string): Promise<IInstructor | null>;
  getInstructorDataById(instructorId: string): Promise<IInstructor | null>;
  updateProfile(id: string, data: object): Promise<IInstructor | null>;
  getTransactionsList(
    email: string, 
    page: number, 
    limit: number, 
    search: string
  ): Promise<TransactionsResult | null>;  updatePassword(email: string, password: string): Promise<IInstructor | null>;
  updatePlanPrice(instructorId:string,planPrice: number): Promise<IInstructor | null>;
  getInstructors(): Promise<IInstructor[] | null>;
  getMentorExpertise(): Promise<string[]>
   getPaginatedMentors(
        page: number, 
        limit: number, 
        search: string, 
        sort: string, 
        expertise: string[]
      ): Promise<PaginatedMentors>
}