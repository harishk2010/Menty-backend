import { IVerificationModel } from "../../models/verificationModel";
import { IGenericRepository } from "../GenericRepository";
import { updateRequestType } from "../../types/types";

export interface IVerificationRepository
  extends IGenericRepository<IVerificationModel> {
  sendVerifyRequest(
    username: string,
    email: string,
    degreeCertificateUrl: string,
    resumeUrl: string
  ): Promise<IVerificationModel>;
  approveRequest(
    email: string,
    status: string,
    comment: string
  ): Promise<IVerificationModel | null>;
  updateRequest(
    email: string,
    data: updateRequestType
  ): Promise<IVerificationModel | null>;
}
