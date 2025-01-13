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
}