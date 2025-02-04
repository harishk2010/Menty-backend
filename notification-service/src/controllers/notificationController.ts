import { SendForgotEmail } from "../utils/sendForgotPasswordEmail";
import { SendEmail } from "../utils/sendOtpEmail";
import {SendVerifiedEmail} from "../utils/verifiedEmail"
import INotificationControllers from "./INotificationControllers";

export class NotificationControllers implements INotificationControllers {
  private sendEmail: SendEmail;
  private sendForgotPasswordEmail: SendForgotEmail;
  private sendVerifiedEmail:SendVerifiedEmail
  constructor() {
    this.sendEmail = new SendEmail();
    this.sendForgotPasswordEmail = new SendForgotEmail();
    this.sendVerifiedEmail=new SendVerifiedEmail()
  }

  async sendOtpEmail(data: { email: string; name: string; otp: string }):Promise<void> {
    try {
      const { name, email, otp } = data;

      await this.sendEmail.sentEmailVerification(name, email, otp);
      console.log("OTP email has been sent");
    } catch (error) {
      console.log(error);
    }
  }
  async sendForgotEmail(data: { email: string; otp: string }):Promise<void> {
    try {
      const { email, otp } = data;
      await this.sendForgotPasswordEmail.sendEmailVerification(email, otp);
      console.log("Forgot OTP email has been sent");
    } catch (error) {
      console.log(error);
    }
  }
  async sendVerifiedInstructorEmail(data: { email: string; username: string }):Promise<void> {
    try {
      const { email,username } = data;
      console.log(email,username,"mail>>>")
      await this.sendVerifiedEmail.sentEmailVerification(username,email);
      console.log("Forgot OTP email has been sent");
    } catch (error) {
      console.log(error);
    }
  }
}
