import { IUser } from "../../models/userModel";
import { GenericRepository } from "../GenericRepository";
import UserModel from "../../models/userModel";
import { IStudentRepository } from "./IStudentRepository";
import { FilterQuery } from "mongoose";
import { PaginationResult } from "../../types/types";

export class StudentRepository extends GenericRepository<IUser> implements IStudentRepository {
  constructor() {
    super(UserModel);
  }

  async searchUsers(
    query: string,
    role: string,
    page: number,
    limit: number
  ): Promise<PaginationResult<IUser>> {
    const skip = (page - 1) * limit;
    const filter: FilterQuery<IUser> = {};

    // Build the search query
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    // Fetch paginated results
    const data = await UserModel.find(filter).skip(skip).limit(limit).exec();
    const total = await UserModel.countDocuments(filter);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }


  async updatePassword(email: string, password: string): Promise<IUser | null> {
    try {
      const response = await UserModel.findOneAndUpdate(
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