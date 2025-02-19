import { IInstructor, ITransaction } from "../../models/instructorModel";
import { GenericRepository } from "../GenericRepository";
import InstructorModel from "../../models/instructorModel";
import { IInstructorRepository } from "./IInstructorRepository";

export class InstructorRepository extends GenericRepository<IInstructor> implements IInstructorRepository {
  constructor() {
    super(InstructorModel);
  }

  /**
   * Get a list of transactions for an instructor.
   * @param email - Email of the instructor.
   * @param currentPage - Current page number for pagination.
   * @param itemsPerPage - Number of items per page.
   * @returns A list of transactions.
   */
  async getTransactionsList(email: string, currentPage: number, itemsPerPage: number): Promise<ITransaction[] | null> {
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const instructor = await InstructorModel.findOne({ email },
        { 
          "wallet.transactions": { 
            $slice: [(currentPage - 1) * itemsPerPage, itemsPerPage] // Pagination
          }, 
          _id: 0 
        })
        if (!instructor) {
            return null;
          }
      
          return instructor?.wallet?.transactions 
    } catch (error) {
      console.error("Error in getTransactionsList:", error);
      throw error;
    }
  }

  /**
   * Update an instructor's password by email.
   * @param email - Email of the instructor.
   * @param password - New password.
   * @returns The updated instructor data.
   */
  async updatePassword(email: string, password: string): Promise<IInstructor | null> {
    try {
      const response = await InstructorModel.findOneAndUpdate(
        { email },
        { $set: { password } },
        { new: true }
      );
      return response;
    } catch (error) {
      console.error("Error in updatePassword:", error);
      throw error;
    }
  }
}