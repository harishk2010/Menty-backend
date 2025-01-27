import { SendForgotEmail } from "../utils/sendForgotPasswordEmail";
import { SendEmail } from "../utils/sendOtpEmail";

export class NotificationControllers {
  private sendEmail: SendEmail;
  private sendForgotPasswordEmail:SendForgotEmail
  constructor() {
    this.sendEmail = new SendEmail();
    this.sendForgotPasswordEmail=new SendForgotEmail()
  }

  async sendOtpEmail(data: { email: string; name: string; otp: string }) {
    try {
      const { name, email, otp } = data;

      await this.sendEmail.sentEmailVerification(name, email, otp);
      console.log("OTP email has been sent")
    } catch (error) {
        console.log(error);
    }
}
async sendForgotEmail(data: { email: string; otp: string }) {
    try {
        const {  email, otp } = data;
        await this.sendForgotPasswordEmail.sendEmailVerification( email, otp);
        console.log("Forgot OTP email has been sent")
    } catch (error) {
      console.log(error);
    }
  }
}
