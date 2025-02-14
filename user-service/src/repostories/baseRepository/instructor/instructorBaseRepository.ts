import { Document, Model } from "mongoose";
import InstructorModel, { IInstructor } from "../../../models/instructorModel";
import { IInstructorBaseRepository } from "./IInstructorBaseRepository";

export class InstructorBaseRepository implements IInstructorBaseRepository{
  

  async createInstructor(payload: IInstructor): Promise<IInstructor | null> {
    try {
      const instructor = await InstructorModel.create(payload);
      await instructor.save();
      return instructor;
    } catch (error) {
      throw error;
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
  async getInstructorDataById(instructorId: string): Promise<IInstructor | null> {
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

  async updatePassword(email: string, password: string): Promise<IInstructor | null> {
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

  async findAllInstructors(): Promise<IInstructor[] > {
    try {
        const response=await InstructorModel.find()
   
        return response
        
    } catch (error) {
        console.log(error);
        throw error;

        
    }
  }
}
