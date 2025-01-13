import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { InstructorServices } from "../services/instructorServices";
import { OtpGenerate } from "../utils/otpGenerator";
import { otpService } from "../services/otpService";
import { SentEmail } from "../utils/senEmail";
import  from '../utils/jwt'

export class InstructorController {
  private instructorService: InstructorServices;
  private otpService:otpService

  constructor() {
    this.instructorService = new InstructorServices();
    this.otpService=new otpService()
  }

  public async instructorSignUp(req: Request, res: Response): Promise<any> {
    try {
      let { email, password } = req.body;
      console.log(email, password);

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      password = hashedPassword;

      const ExistingInstructor = await this.instructorService.findByEmail(
        email
      );

      console.log(ExistingInstructor, "ExistingInstructor");

      if (ExistingInstructor) {
        return res.status(201).send({
          success: true,
          message: "Existing user",
          user: ExistingInstructor,
        });
      }
      const otpGenerator = new OtpGenerate();
      const otp = await otpGenerator.createOtpDigit();
      await this.otpService.createOtp(email,otp)
      const sendEmail= new SentEmail()
      await sendEmail.sentEmailVerification(email,otp)
      const JWT=new 
      const token = await jwt.create_verification_jwt({ email ,password})
        return token
      // const token=await this.instructorService.signUp({email,password})
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}
