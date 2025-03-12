import otpModel, { Iotp } from "../models/otpModel";
import IOtpRepository from "./interfaces/IOtpRespoitory";

import { GenericRepository } from "./GenericRepository";
import { GeneralServerErrorMsg, OtpResponses } from "../utils/constants";

export class OtpRespository
  extends GenericRepository<Iotp>
  implements IOtpRepository
{
  constructor() {
    super(otpModel);
  }
  public async createOtp(email: string, otp: string): Promise<Iotp | null> {
    try {
      const response = await this.updateOne({ email }, { otp });
      if (!response) {
        return await this.create({ email, otp } as Iotp); 
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async findOtp(email: string): Promise<Iotp | null> {
    try {
      const response = await this.findOne({ email });
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async deleteOtp(email: string): Promise<Iotp | null> {
    try {
      const otpData = await this.findOne({ email });

      if (!otpData) {
        throw new Error(OtpResponses.NO_OTP_DATA);
      }
      const otpId = otpData._id as unknown as string;
      const response = await this.delete(otpId);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
