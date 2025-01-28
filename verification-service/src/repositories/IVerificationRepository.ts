import { IVerificationModel } from "../models/verificationModel";

export interface IVerificationRepository{
    sendVerifyRequest(username:string,email:string,degreeCertificateUrl:string,resumeUrl:string):Promise<IVerificationModel >
}