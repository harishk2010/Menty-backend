import { IVerificationModel } from "../models/verificationModel";
import { IVerificationBaseRepository } from "./baseRepository/IVerificationBaseRepository";
import { VerificationBaseRepository } from "./baseRepository/verificationBaseRepository";
import { IVerificationRepository } from "./IVerificationRepository";

export class VerificationRepository implements IVerificationRepository {
    private verificationBaseRepository:IVerificationBaseRepository
    constructor(verificationBaseRepository:IVerificationBaseRepository){
        this.verificationBaseRepository=verificationBaseRepository
    }
    async sendVerifyRequest(username:string,email:string,degreeCertificateUrl:string,resumeUrl:string):Promise<IVerificationModel>{
        try {
            const response=await this.verificationBaseRepository.createRequest(username,email,degreeCertificateUrl,resumeUrl)
            return response
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
        }
    }
}