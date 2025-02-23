import { Iotp } from "../interface/otp"
import baseOtpRepository from "./baseRepositories/baseOtpRepository"
import otpModel from "../models/otpModel"
import IOtpRepository from "./interfaces/IOtpRespoitory"
import IOtpBaseRepository from "./baseRepositories/interfaces/IOtpBaseRepository"
import { GenericRepository } from "./GenericRepository"

export class OtpRespository extends GenericRepository<Iotp> implements IOtpRepository{
    // private baseOtpRepository:IOtpBaseRepository
    constructor(){
        super(otpModel)

    }
    public async createOtp(email:string,otp:string): Promise<Iotp | null>{
        try {
            const response = await this.updateOne({ email }, { otp });
        if (!response) {
            return await this.create({ email, otp } as Iotp); // Ensure `email` and `otp` exist
        }
        return response;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    public async findOtp(email:string): Promise<Iotp | null>{
       try {
        const response=await this.findOne({email})
        console.log(response,"otprepo")
        return response
        
       } catch (error) {
        console.log(error)
        throw error
       }
       
        
    }
    public async deleteOtp(email:string): Promise<Iotp | null>{
       
       try {
        const otpData=await this.findOne({email})

        if(!otpData){
            throw new Error("No Otp Data found")
        }
        const otpId=(otpData._id as unknown as string)
           const response=await this.delete(otpId)
           return response
        
       } catch (error) {
        console.log(error)
        throw error
       }
    }
}