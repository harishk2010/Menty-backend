import { IVerificationService } from "../interfaces/IVerificationService";
import { VerificationRepository } from "../../repostories/verification/verificationRepository";
import { IVerificationModel } from "../../models/verificationModel";
import { updateRequestType } from "../../types/types";
import { IVerificationRepository } from "../../repostories/interfaces/IVerificationRepository";

export class VerificationService implements IVerificationService {
  private verificationRepository: IVerificationRepository;

  constructor(verificationRepository: IVerificationRepository) {
    this.verificationRepository = verificationRepository;
  }

  async sendVerifyRequest(
    username: string,
    email: string,
    degreeCertificateUrl: string,
    resumeUrl: string
  ): Promise<IVerificationModel> {
    return await this.verificationRepository.sendVerifyRequest(
      username,
      email,
      degreeCertificateUrl,
      resumeUrl
    );
  }

  async getRequestData(email: string): Promise<IVerificationModel | null> {
    return await this.verificationRepository.findOne({ email });
  }

  async approveRequest(
    email: string,
    status: string
  ): Promise<IVerificationModel | null> {
    return await this.verificationRepository.approveRequest(email, status);
  }

  async getAllRequests(): Promise<IVerificationModel[] | null> {
    return await this.verificationRepository.findAll();
  }

  async updateRequest(
    email: string,
    data: updateRequestType
  ): Promise<IVerificationModel | null> {
    return await this.verificationRepository.updateRequest(email, data);
  }
}
