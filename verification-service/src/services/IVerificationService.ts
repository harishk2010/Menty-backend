import { IVerificationModel } from '../models/verificationModel'


export interface IVerificationService{
    sendVerifyRequest(username:string,email:string,degreeCertificateUrl:string,resumeUrl:string):Promise<IVerificationModel>
}