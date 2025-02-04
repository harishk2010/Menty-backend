
import { IInstructor } from "../../models/instructorModel";
import { IUser } from "../../models/userModel";
import { Request, Response } from "express";

export default interface IInstructorServices {
    findByEmail(email:string): Promise<IInstructor | null>;
    createUser(userData:any): Promise<IInstructor | null>;
    resetPassword(email:string,password:string): Promise<IInstructor | null>;
    googleLogin(name: string, email: string, password: string): Promise<IInstructor | null>;
    updateProfile( email: string,data:any): Promise<IInstructor | null>;
   
}
