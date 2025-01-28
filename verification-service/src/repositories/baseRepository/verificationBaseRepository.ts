import VerificationModel, { IVerificationModel } from "../../models/verificationModel";
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
           throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
}