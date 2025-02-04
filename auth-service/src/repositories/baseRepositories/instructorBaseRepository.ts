
import { NextFunction } from "http-proxy-middleware/dist/types"
import InstructorModel, { IInstructor } from "../../models/instructorModel"
import { Document , Model } from "mongoose"
import bcrypt from "bcrypt";
import IInstructorBaseRepository from "./interfaces/IInstructorBaseRepository";
export default class InstructorBaseRepository implements IInstructorBaseRepository{
    
    
    async findByEmail(email:string):Promise<IInstructor|null >{
        try {
            
            return await InstructorModel.findOne({email:email})
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    async createInstructor(userData:any):Promise<IInstructor |null>{
        try {
            const user=await InstructorModel.create(userData)
            await user.save()
            return user
        } catch (error) {
            console.log(error);
            throw error
            
        }


    }
    
    async resetPassword(email:string,password:string):Promise<IInstructor|null >{
        try {
            const updatedUser = await InstructorModel.findOneAndUpdate(
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
        password: string,
        
    ): Promise<IInstructor | null> {
        try {
            const user = await this.findByEmail(email);
    
            if (!user) {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
    
                // Create a new user
                const newUser = await this.createInstructor({
                    username:name,
                    email,
                    password: hashedPassword,
                });
    
                if (!newUser) {
                    // Handle unexpected null from createInstructor
                    throw (new Error("Failed to create a new instructor"));
                }
    
                if (newUser.isBlocked) {
                    throw (new Error("Admin blocked the user"));
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
    async updateProfile(email:string,data: any): Promise<IInstructor | null> {
        try {
          
          const response = await InstructorModel.findOneAndUpdate(
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