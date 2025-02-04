
import { IInstructor } from "../../models/instructorModel";
import { IUser } from "../../models/userModel";
import { Request, Response } from "express";

export default interface IStudentServices {
    findByEmail(email:string): Promise<IUser | null>;
    createUser(userData:any): Promise<IUser | null>;
    resetPassword(email:string,password:string): Promise<IUser | null>;
    googleLogin(name: string, email: string, password: string): Promise<IUser | null>;
    updateProfile( email: string,data:any): Promise<IUser | null>;
   
}
