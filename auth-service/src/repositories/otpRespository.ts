import { Iotp } from "../interface/otp"
import baseOtpRepository from "./baseRepositories/baseOtpRepository"
import otpModel from "../models/otpModel"

export class otpRespository{
    private baseOtpRepository:baseOtpRepository<Iotp>
    constructor(){
        this.baseOtpRepository=new baseOtpRepository(otpModel)

    }
    public async createOtp(email:string,otp:string){
        const response = await this.baseOtpRepository.saveOtp(email,otp)
        return response
    }
    public async findOtp(email:string){
        const response=await this.baseOtpRepository.findOtp(email)
        return response
    }
    public async deleteOtp(email:string){
        const response=await this.baseOtpRepository.deleteOtp(email)
        return response
    }
}