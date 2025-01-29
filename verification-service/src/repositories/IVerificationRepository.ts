import { IVerificationModel } from "../models/verificationModel";

export interface IVerificationRepository{
    sendVerifyRequest(username:string,email:string,degreeCertificateUrl:string,resumeUrl:string):Promise<IVerificationModel >
    getRequestDataByEmail(email:string):Promise<IVerificationModel | null>
    getAllRequests():Promise<IVerificationModel[] | null>
}