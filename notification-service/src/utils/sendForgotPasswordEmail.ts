import { IForgotEmail } from "../interface/Email";
import nodeMailer from "nodemailer";
import { config } from "dotenv";
config();

export class SendForgotEmail implements IForgotEmail {
  async sendEmailVerification(
    email: string,
    verification: string
  ): Promise<any> {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const sendVerificationEmail = async (
      // name: string,
      toEmail: string,
      verificationCode: string
    ) => {
      const mailOptions = {
        from: process.env.USER_EMAIL, // Will set this via env variables later
        to: toEmail,
        subject: "🌟Forgot Password OTP -  Menty - Verify Your Email 🌟",
        text: `Hello ,\n\nYour verification code is: ${verificationCode}\n\nThanks,\nThe Menty Team`, // Plain-text fallback
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; text-align: center; border-radius: 8px; background-color: #f7f7f7;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; display: inline-block; width: 80%; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4CAF50; margin-bottom: 10px;">Forgot Password Request</h2>
            <p style="font-size: 1.1em; margin-bottom: 20px;">We received a request to reset your password for your Menty account. Please use the OTP code below to proceed with resetting your password:</p>
            <div style="margin: 20px 0; font-size: 1.5em; font-weight: bold; color: #4CAF50; background: #f0f0f0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                ${verificationCode}
            </div>
            <p>If you didn’t request this, please ignore this email. Your password will remain unchanged.</p>
            <br>
            <p>Thank you,</p>
            <p><strong>The Menty Team</strong></p>
            <div style="margin-top: 20px; font-size: 0.9em; color: #777;">
                <p>Need help? Contact us at <a href="mailto:support@menty.com" style="color: #4CAF50;">support@menty.com</a></p>
                <p>Follow us on:</p>
                <a href="https://twitter.com/Menty" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Twitter</a> |
                <a href="https://facebook.com/Menty" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Facebook</a> |
                <a href="https://instagram.com/Menty" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Instagram</a>
            </div>
        </div>
    </div>
`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.response}`);
        return info;
      } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email");
      }
    };

    await sendVerificationEmail(email, verification);
  }
}
