import { IVerificationRepository } from '../repositories/IVerificationRepository'
import {IVerificationService} from './IVerificationService'
import { IVerificationModel } from '../models/verificationModel'

export class VerificationService implements IVerificationService{
    
    private verificationRepository:IVerificationRepository
    constructor(verificationRepository:IVerificationRepository){
        this.verificationRepository=verificationRepository
    }
    async sendVerifyRequest(username:string,email:string,degreeCertificateUrl:string,resumeUrl:string):Promise<IVerificationModel>{
        try {
            console.log(username,email,degreeCertificateUrl,resumeUrl,"verificationnnn serviceee")
            const response=await this.verificationRepository.sendVerifyRequest(username,email,degreeCertificateUrl,resumeUrl)
            return response
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
}