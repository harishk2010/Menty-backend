export interface otpGenerateI {
    createOtpDigit(length?: number): Promise<string>;
  }
  