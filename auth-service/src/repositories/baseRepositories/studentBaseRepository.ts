import { NextFunction } from "http-proxy-middleware/dist/types";
import { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import UserModel, { IUser } from "../../models/userModel";
import IStudentBaseRepository from "./interfaces/IStudentBaseRepository";
export default class StudentBaseRepository implements IStudentBaseRepository {
 

  async findByEmail(email: string): Promise<IUser | null> {
    console.log("student");
    return await UserModel.findOne({ email: email });
  }
  async createStudent(userData: any): Promise<IUser | null> {
    try {
      const user = await UserModel.create(userData);
      await user.save();
      return user;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async resetPassword(email: string, password: string): Promise<IUser | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: email },
        { password: password },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async googleLogin(
    name: string,
    email: string,
    password: string
  ): Promise<IUser | null> {
    try {
      const user = await this.findByEmail(email);

      if (!user) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await this.createStudent({
          name,
          email,
          password: hashedPassword,
        });

        if (!newUser) {
          // Handle unexpected null from createInstructor
          throw new Error("Failed to create a new instructor");
        }

        if (newUser.isBlocked) {
          throw new Error("Admin blocked the user");
        }

        return newUser;
      }

      // If user exists, check if they are blocked
      if (user.isBlocked) {
        throw new Error("Admin blocked the user");
      }

      // Return the existing user if not blocked
      return user;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async updateProfile(email:string,data: any): Promise<IUser | null> {
    try {
      
      const response = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: 
            data
            
          ,
        },
        {
          new: true,
        }
      );
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
