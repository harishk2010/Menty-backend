import { Document, Model } from "mongoose";
import UserModel, { IUser } from "../../models/userModel";

export class StudentBaseRepository<T extends Document> {
  private model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async createStudent(payload: IUser): Promise<IUser | null> {
    try {
      const student = await UserModel.create(payload);
      await student.save();
      return student;
    } catch (error) {
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
  async updateProfile(id: string, data: object): Promise<IUser | null> {
    try {
      const studentData = await UserModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return studentData;
    } catch (error) {
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
      throw error;
    }
  }

  async findAllStudents(){
    try {
        const response=await UserModel.find()
        console.log(response,"getall students")
        return response
        
    } catch (error) {
        console.log(error);
        
    }
  }
}
