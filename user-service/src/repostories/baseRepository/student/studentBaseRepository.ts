import UserModel, { IUser } from "../../../models/userModel";
import { Document, Model } from "mongoose";
import { IStudentBaseRepository } from "./IStudentBaseRepository";


export class StudentBaseRepository implements IStudentBaseRepository {
 

  async createStudent(payload: IUser): Promise<IUser | null> {
    try {
      const student = await UserModel.create(payload);
      await student.save();
      return student;
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }

  async getStudentData(email: string): Promise<IUser | null> {
    try {
      const studentData = await UserModel.findOne({ email: email });
      return studentData;
    } catch (error) {
      throw error;
    }
  }
  async updateProfile(id: any, data: object): Promise<IUser | null> {
    try {
      const studentData = await UserModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return studentData;
    } catch (error) {
      console.log(error);
      throw error;
          }
  }

  async updatePassword(email: string, password: string): Promise<IUser | null> {
    try {
      const studentData = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            password: password,
          },
        },
        { new: true }
      );
      return studentData;
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }

  async findAllStudents():Promise<IUser[]>{
    try {
        const response=await UserModel.find()
        return response
        
    } catch (error) {
        console.log(error);
        throw error;
        
    }
  }
}
