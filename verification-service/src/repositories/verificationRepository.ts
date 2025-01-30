import { updateRequestType } from "../Types/updateRequestType";
import { IVerificationModel } from "../models/verificationModel";
import { IVerificationBaseRepository } from "./baseRepository/IVerificationBaseRepository";
import { VerificationBaseRepository } from "./baseRepository/verificationBaseRepository";
import { IVerificationRepository } from "./IVerificationRepository";

export class VerificationRepository implements IVerificationRepository {
    private verificationBaseRepository:IVerificationBaseRepository
    constructor(verificationBaseRepository:IVerificationBaseRepository){
        this.verificationBaseRepository=verificationBaseRepository
    }
    async sendVerifyRequest(username:string,email:string,degreeCertificateUrl:string,resumeUrl:string):Promise<IVerificationModel >{
        try {
            const response=await this.verificationBaseRepository.createRequest(username,email,degreeCertificateUrl,resumeUrl)
            return response
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
        }
    }
    async getRequestDataByEmail(email:string):Promise<IVerificationModel | null>{
        try {
            const response=await this.verificationBaseRepository.getRequestDataByEmail(email)

            return response 
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
        }
    }
    async getAllRequests():Promise<IVerificationModel[] | null>{
        try {
            const response=await this.verificationBaseRepository.getAllRequests()

            return response 
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
        }
    }
    async approveRequest(email:string,status:string):Promise<IVerificationModel | null>{
        try {
            const response=await this.verificationBaseRepository.approveRequest(email,status)

            return response 
        } catch (error) {
            console.log(error)
            throw new Error("Verify Request Document failed Creation")
            
        }
    }
    async updateRequest(email:string,data:updateRequestType):Promise<IVerificationModel | null>{
        try {
            const response=await this.verificationBaseRepository.updateRequest(email,data)

            return response 
        } catch (error) {
            console.log(error)
            throw new Error("updateRequest Document failed Creation")
            
        }
    }
}