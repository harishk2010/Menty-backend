
import { Iotp } from "./otp";
import { IInstructor } from "../models/instructorModel";
import { IUser } from "../models/userModel";
import { Request, Response } from "express";

export default interface IOtpRepository {
    findOtp(email:string): Promise<Iotp | null> ;
    deleteOtp(email:string): Promise<Iotp | null> ;
    createOtp(email:string,otp:string): Promise<Iotp | null> ;  
}
