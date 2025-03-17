import { IEmail } from "../interface/Email";
import nodeMailer from "nodemailer";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}
export class SendVerifiedEmail implements IEmail {
  async sentEmailVerification(username: string, email: string): Promise<any> {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw new Error("Invalid recipient email address");
    }

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

    const sendVerificationEmail = async (username: string, toEmail: string) => {
      const mailOptions = {
        from: process.env.USER_EMAIL, // Sender email
        to: toEmail, // Recipient email
        subject: "🎉 Welcome to Menty - Your Account is Verified! 🎉",
        text: `Hello ${username},\n\nYour account has been successfully verified. You can now access all the features of our e-learning platform.\n\nThanks,\nThe Menty Team`, // Plain-text fallback
        html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; text-align: center; border-radius: 8px; background-color: #f7f7f7; background: url('https://cdn.wallpapersafari.com/13/89/wb4WOU.jpg') no-repeat center center; background-size: cover;">
                        <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 8px; display: inline-block; width: 80%; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #4CAF50; margin-bottom: 10px;">🎉 Welcome to Menty, ${username}! 🎉</h2>
                            <p style="font-size: 1.1em; margin-bottom: 20px;">We're thrilled to inform you that your account has been successfully verified. You now have full access to our e-learning platform and its features.</p>
                            
                            <div style="margin: 20px 0; font-size: 1.2em; font-weight: bold; color: #4CAF50; background: #f0f0f0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                                Account Verified Successfully!
                            </div>

                            <h3 style="color: #4CAF50; margin-bottom: 10px;">What You Can Do Now:</h3>
                            <ul style="text-align: left; margin: 20px auto; width: 80%;">
                                <li>Create and manage your courses.</li>
                                <li>Upload lectures, assignments, and quizzes.</li>
                                <li>Interact with students through discussions and feedback.</li>
                                <li>Track student progress and performance.</li>
                                <li>Access premium resources and tools.</li>
                            </ul>

                            <p style="font-size: 1.1em; margin-bottom: 20px;">If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@menty.com" style="color: #4CAF50; text-decoration: none;">support@menty.com</a>.</p>

                            <p>Thank you for joining Menty. We're excited to have you as part of our community!</p>
                            <br>
                            <p>Best regards,</p>
                            <p><strong>The Menty Team</strong></p>

                            <div style="margin-top: 20px; font-size: 0.9em; color: #777;">
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
      } catch (error: any) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send verification email: ${error.message}`);
      }
    };

    await sendVerificationEmail(username, email);
  }
}
