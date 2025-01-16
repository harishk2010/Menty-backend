import { IEmail } from "../interface/IEmail";
import nodeMailer from 'nodemailer'

const USER_EMAIL : string = `harish200126@gmail.com`
const USER_PASSWORD : string = `xyrk jiuf cnvm uian`

export class SentEmail implements IEmail {
    async sentEmailVerification( email: string, verification: string): Promise<any> {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_EMAIL,
                pass: USER_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
              }
        })

        const sendVerificationEmail = async (
            // name: string,
            toEmail: string,
            verificationCode: string
        ) => {
            const mailOptions = {
                from: USER_EMAIL, // Will set this via env variables later
                to: toEmail,
                subject: '🌟 Welcome to Menty - Verify Your Email 🌟',
                text: `Hello ,\n\nYour verification code is: ${verificationCode}\n\nThanks,\nThe Menty Team`, // Plain-text fallback
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; text-align: center; border-radius: 8px; background-color: #f7f7f7; background: url('https://cdn.wallpapersafari.com/13/89/wb4WOU.jpg') no-repeat center center; background-size: cover;">
                        <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 8px; display: inline-block; width: 80%; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #4CAF50; margin-bottom: 10px;">Welcome to Menty, !</h2>
                            <p style="font-size: 1.1em; margin-bottom: 20px;">We're excited to have you onboard. Please use the verification code below to complete your email verification:</p>
                            <div style="margin: 20px 0; font-size: 1.5em; font-weight: bold; color: #4CAF50; background: #f0f0f0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                                ${verificationCode}
                            </div>
                            <p>If you didn’t request this, please ignore this email.</p>
                            <br>
                            <p>Thank you,</p>
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
            } catch (error) {
                console.error('Error sending email:', error);
                throw new Error('Failed to send verification email');
            }
        };
        
        await sendVerificationEmail(email,verification);
    }
}