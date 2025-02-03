import { updateRequestType } from "../../../types/types";
import VerificationModel, { IVerificationModel } from "../../../models/verificationModel";
import { IVerificationBaseRepository } from "./IVerificationBaseRepository";

export class VerificationBaseRepository implements IVerificationBaseRepository{


    async createRequest(username:string,email:string,degreeCertificateUrl:string,resumeUrl:string):Promise<IVerificationModel >{
        try {
            const verifyRequest=await VerificationModel.create({username,email,degreeCertificateUrl,resumeUrl})
            if(!verifyRequest){
                throw new Error("Verify Request Document failed Creation")
            }
            await verifyRequest.save()
            return verifyRequest
        } catch (error) {
            console.log(error)
           throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async getRequestDataByEmail(email:string):Promise<IVerificationModel | null>{
        try {
            const requestData=await VerificationModel.findOne({email})
            if(!requestData){
                return null
            }
          
            return requestData
        } catch (error) {
           throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async getAllRequests():Promise<IVerificationModel[] | null>{
        try {
            const requestData=await VerificationModel.find({})
            if(!requestData){
                return null
            }
          
            return requestData
        } catch (error) {
           throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async approveRequest(email:string,status:string):Promise<IVerificationModel | null>{
        try {
            const requestData=await VerificationModel.findOneAndUpdate(
                {email},
                {status},
                { new: true}
            )
            if(!requestData){
                return null
            }
          
            return requestData
        } catch (error) {
           throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async updateRequest(email:string,data:updateRequestType):Promise<IVerificationModel | null>{
        try {
            console.log("before>>",email,data)
            const requestData=await VerificationModel.findOneAndUpdate(
                {email},
                data,
                { new: true}
            )
            console.log("after>>",requestData)
            if(!requestData){
                return null
            }
          
            return requestData
        } catch (error) {
           throw new Error("updateRequest Document failed Creation")
            
            
        }
    }
}