import { IVerificationModel } from "../../models/verificationModel";

export interface IVerificationBaseRepository{
    createRequest(
        username:string,
        email:string,
        degreeCertificateUrl:string,
        resumeUrl:string
    ):Promise<IVerificationModel >
}