import { Iotp } from "../models/otpModel";
import IOtpRepository from "../repositories/interfaces/IOtpRespoitory";
import IOtpServices from "./interfaces/IOtpService";

export class OtpService implements IOtpServices {
  private otpRespository: IOtpRepository;
  constructor(otpRespository: IOtpRepository) {
    this.otpRespository = otpRespository;
  }
  public async createOtp(email: string, otp: string) {
    try {
      const response = await this.otpRespository.createOtp(email, otp);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async findOtp(email: string): Promise<Iotp | null> {
    try {
      const response = await this.otpRespository.findOtp(email);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async deleteOtp(email: string) {
    try {
      const response = await this.otpRespository.deleteOtp(email);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
