import { Iotp } from "../interface/otp"
import baseOtpRepository from "./baseRepositories/baseOtpRepository"
import otpModel from "../models/otpModel"
import IOtpRepository from "./interfaces/IOtpRespoitory"
import IOtpBaseRepository from "./baseRepositories/interfaces/IOtpBaseRepository"

export class OtpRespository implements IOtpRepository{
    private baseOtpRepository:IOtpBaseRepository
    constructor(baseOtpRepository:IOtpBaseRepository){
        this.baseOtpRepository=baseOtpRepository

    }
    public async createOtp(email:string,otp:string): Promise<Iotp | null>{
        try {
            
            const response = await this.baseOtpRepository.saveOtp(email,otp)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    public async findOtp(email:string): Promise<Iotp | null>{
       try {
        const response=await this.baseOtpRepository.findOtp(email)
        console.log(response,"otprepo")
        return response
        
       } catch (error) {
        console.log(error)
        throw error
       }
       
        
    }
    public async deleteOtp(email:string): Promise<Iotp | null>{
       
       try {
           const response=await this.baseOtpRepository.deleteOtp(email)
           return response
        
       } catch (error) {
        console.log(error)
        throw error
       }
    }
}