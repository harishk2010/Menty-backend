
import { IInstructor } from "../../models/instructorModel";
import { IUser } from "../../models/userModel";
import { Request, Response } from "express";

export default interface IInstructorRepository {
    findByEmail(email:string): Promise<IInstructor | null>;
    createUser(userData:any): Promise<IInstructor | null>;
    resetPassword(email:string,password:string): Promise<IInstructor | null>;
    googleLogin(name: string, email: string, password: string): Promise<IInstructor | null>;
    updateProfile( email: string,data:{ username: string ,profilePicUrl:string }): Promise<IInstructor | null>;
   
}
