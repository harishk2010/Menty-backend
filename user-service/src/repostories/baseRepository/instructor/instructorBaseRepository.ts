import { Document, Model } from "mongoose";
import InstructorModel, { IInstructor, ITransaction } from "../../../models/instructorModel";
import { IInstructorBaseRepository } from "./IInstructorBaseRepository";

export class InstructorBaseRepository implements IInstructorBaseRepository {
  async createInstructor(payload: IInstructor): Promise<IInstructor | null> {
    try {
      const instructor = await InstructorModel.create(payload);
      await instructor.save();
      return instructor;
    } catch (error) {
      throw error;
    }
  }
  async getTransactionsList(
    email: string,
    currentPage: number,
    itemsPerPage: number
  ): Promise<ITransaction[] | null> {
    try {
      // const transactionsDetails = await InstructorModel.findOne(
      //   { email },
      //   { "wallet.transactions": 1,_id:0}
      // ).sort({"wallte.transactions.date":-1}).skip((currentPage-1)*itemsPerPage).limit(itemsPerPage)
      // if(!transactionsDetails){
      //   return null
      // }
      // return transactionsDetails
      const instructor = await InstructorModel.findOne(
        { email },
        { 
          "wallet.transactions": { 
            $slice: [(currentPage - 1) * itemsPerPage, itemsPerPage] // Pagination
          }, 
          _id: 0 
        }
      )
  
      if (!instructor) {
        return null;
      }
  
      return instructor?.wallet?.transactions 
    } catch (error) {
      throw error
    }
  }

  async getInstructorData(email: string): Promise<IInstructor | null> {
    try {
      const instructorData = await InstructorModel.findOne({ email: email });
      return instructorData;
    } catch (error) {
      throw error;
    }
  }
  async getInstructorDataById(
    instructorId: string
  ): Promise<IInstructor | null> {
    try {
      const instructorData = await InstructorModel.findById(instructorId);
      return instructorData;
    } catch (error) {
      throw error;
    }
  }
  async updateProfile(id: any, data: object): Promise<IInstructor | null> {
    try {
      const instructorData = await InstructorModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return instructorData;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    email: string,
    password: string
  ): Promise<IInstructor | null> {
    try {
      const instructorData = await InstructorModel.findOneAndUpdate(
        { email },
        {
          $set: {
            password: password,
          },
        },
        { new: true }
      );
      return instructorData;
    } catch (error) {
      throw error;
    }
  }

  async findAllInstructors(): Promise<IInstructor[]> {
    try {
      const response = await InstructorModel.find();

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
