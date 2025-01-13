import { otpRespository } from "../repositories/otpRespository"

export class otpService{
    private otpRespository:otpRespository
    constructor(){
        this.otpRespository=new otpRespository()

    }
    public async createOtp(email:string,otp:string){
        const response= await this.otpRespository.createOtp(email,otp)
        return response
    }
}