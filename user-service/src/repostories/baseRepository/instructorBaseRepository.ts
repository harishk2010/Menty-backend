import { Document, Model } from "mongoose";
import InstructorModel, { IInstructor } from "../../models/instructorModel";

export class InstructorBaseRepository<T extends Document> {
  private model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

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

  async findAllInstructors(){
    try {
        const response=await InstructorModel.find()
        return response
        
    } catch (error) {
        console.log(error);
        
    }
  }
}
