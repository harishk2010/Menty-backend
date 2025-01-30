import { updateRequestType } from "../../Types/updateRequestType";
import { IVerificationModel } from "../../models/verificationModel";

export interface IVerificationBaseRepository{
    createRequest(
        username:string,
        email:string,
        degreeCertificateUrl:string,
        resumeUrl:string
    ):Promise<IVerificationModel >

    getRequestDataByEmail(       
        email:string,        
    ):Promise<IVerificationModel | null >
    getAllRequests():Promise<IVerificationModel[] | null >
    approveRequest(       
        email:string, 
        status:string       
    ):Promise<IVerificationModel | null >
    updateRequest(email:string,data:updateRequestType):Promise<IVerificationModel | null >
}