import { IInstructor, ITransaction } from "../../models/instructorModel";
import { GenericRepository } from "../GenericRepository";
import InstructorModel from "../../models/instructorModel";
import { IInstructorRepository } from "./IInstructorRepository";
import { TransactionsResult } from "../../types/types";

export class InstructorRepository extends GenericRepository<IInstructor> implements IInstructorRepository {
  constructor() {
    super(InstructorModel);
  }

  async getTransactionsList(
    email: string,
    page: number,
    limit: number,
    search: string = ''
  ): Promise<TransactionsResult | null> {
    try {
      // Find the instructor first
      const instructor = await InstructorModel.findOne({ email });
      
      if (!instructor || !instructor.wallet || !instructor.wallet.transactions) {
        return null;
      }
      
      // Filter transactions by search term if provided
      let filteredTransactions = instructor.wallet.transactions;
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredTransactions = filteredTransactions.filter(txn => {
          const txnid = txn.txnid?.toLowerCase() ?? "";
          const description = txn.description?.toLowerCase() ?? "";
          const type = txn.type?.toLowerCase() ?? "";
          const amount = txn.amount?.toString() ?? "";
      
          return (
            txnid.includes(searchLower) ||
            description.includes(searchLower) ||
            type.includes(searchLower) ||
            amount.includes(search)
          );
        });
      }
      
      // Get total count for pagination
      const total = filteredTransactions.length;
      
      // Sort by date descending (most recent first)
      filteredTransactions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Apply pagination
      const skip = (page - 1) * limit;
      const paginatedTransactions = filteredTransactions.slice(skip, skip + limit);
      
      return {
        transactions: paginatedTransactions,
        total
      };
    } catch (error) {
      console.error("Error in getTransactionsList repository:", error);
      throw error;
    }
  }

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