import { IInstructor, ITransaction } from "../../models/instructorModel";
import { GenericRepository } from "../GenericRepository";
import InstructorModel from "../../models/instructorModel";
import { IInstructorRepository } from "../interfaces/IInstructorRepository";
import { PaginatedMentors, TransactionsResult } from "../../types/types";

export class InstructorRepository
  extends GenericRepository<IInstructor>
  implements IInstructorRepository
{
  constructor() {
    super(InstructorModel);
  }

  async getTransactionsList(
    email: string,
    page: number,
    limit: number,
    search: string = ""
  ): Promise<TransactionsResult | null> {
    try {
      // Find the instructor first
      const instructor = await InstructorModel.findOne({ email });

      if (
        !instructor ||
        !instructor.wallet ||
        !instructor.wallet.transactions
      ) {
        return null;
      }

      // Filter transactions by search term if provided
      let filteredTransactions = instructor.wallet.transactions;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredTransactions = filteredTransactions.filter((txn) => {
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

      const total = filteredTransactions.length;

      filteredTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Apply pagination
      const skip = (page - 1) * limit;
      const paginatedTransactions = filteredTransactions.slice(
        skip,
        skip + limit
      );

      return {
        transactions: paginatedTransactions,
        total,
      };
    } catch (error) {
      console.error("Error in getTransactionsList repository:", error);
      throw error;
    }
  }
  async getMentorExpertise(): Promise<string[]> {
    try {
      const result = await InstructorModel.distinct("expertise", {
        isBlocked: false,
      });
      return result.filter(Boolean); // Filter out null/empty values
    } catch (error) {
      throw error;
    }
  }

  async getPaginatedMentors(
    page: number,
    limit: number,
    search: string,
    sort: string,
    expertise: string[]
  ): Promise<PaginatedMentors> {
    try {
      const skip = (page - 1) * limit;

      // Build filter object
      let filter: any = { isBlocked: false };

      // Add search functionality
      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: "i" } },
          { expertise: { $regex: search, $options: "i" } },
          { skills: { $regex: search, $options: "i" } },
        ];
      }

      // Add expertise filter
      if (expertise && expertise.length > 0) {
        filter.expertise = {
          $in: expertise.map((exp) => new RegExp(exp, "i")),
        };
      }

      // Determine sort order
      let sortOption: any = {};
      switch (sort) {
        case "price-low":
          sortOption = { planPrice: 1 };
          break;
        case "price-high":
          sortOption = { planPrice: -1 };
          break;
        case "expertise":
          sortOption = { expertise: 1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "verified":
        default:
          sortOption = { isVerified: -1, username: 1 };
          break;
      }

      // Execute query with pagination and sorting
      const mentors = await InstructorModel.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec();

      // Get total count for pagination
      const totalMentors = await InstructorModel.countDocuments(filter);

      return {
        mentors,
        currentPage: page,
        totalPages: Math.ceil(totalMentors / limit),
        totalMentors,
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    email: string,
    password: string
  ): Promise<IInstructor | null> {
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
