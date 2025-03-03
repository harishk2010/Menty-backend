import { IVerificationModel } from "../../models/verificationModel";
import { GenericRepository } from "../GenericRepository";
import VerificationModel from "../../models/verificationModel";
import { IVerificationRepository } from "../../interfaces/IVerificationRepository";
import { updateRequestType } from "../../types/types";

export class VerificationRepository extends GenericRepository<IVerificationModel> implements IVerificationRepository {
  constructor() {
    super(VerificationModel);
  }

  async sendVerifyRequest(
    username: string,
    email: string,
    degreeCertificateUrl: string,
    resumeUrl: string
  ): Promise<IVerificationModel> {
    try {
      const response = await this.create({
        username,
        email,
        degreeCertificateUrl,
        resumeUrl,
      });
      return response;
    } catch (error) {
      throw new Error("Verify Request Document failed Creation");
    }
  }

  async approveRequest(email: string, status: string): Promise<IVerificationModel | null> {
    try {
        const user = await this.findOne({ email });
    
        if (!user) {
          throw new Error("User not found");
        }
        // Ensure _id is a valid string
        const userId = (user._id as unknown as string);
      const response = await this.update(
        userId,
        { status }
      );
      return response;
    } catch (error) {
      throw new Error("Verify Request Document failed Creation");
    }
  }

  async updateRequest(email: string, data: updateRequestType): Promise<IVerificationModel | null> {
    try {

        const user = await this.findOne({ email });
    
    if (!user) {
      throw new Error("User not found");
    }
    // Ensure _id is a valid string
    const userId = (user._id as unknown as string);

    // Pass user's _id to update
    const response = await this.update(userId, data);
    return response;
    } catch (error) {
      throw new Error("updateRequest Document failed Creation");
    }
  }
}