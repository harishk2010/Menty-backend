import { Iotp } from "../../models/otpModel";

export default interface IOtpRepository {
  findOtp(email: string): Promise<Iotp | null>;
  deleteOtp(email: string): Promise<Iotp | null>;
  createOtp(email: string, otp: string): Promise<Iotp | null>;
}
