import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { InstructorServices } from "../services/instructorServices";
import { OtpGenerate } from "../utils/otpGenerator";
import { otpService } from "../services/otpService";
import { SentEmail } from "../utils/senEmail";
import { JwtService } from "../utils/jwt";
import { IInstructor } from "@/models/instructorModel";
import { access_token_options, refresh_token_options } from "../utils/tokenOptions";
// import  from '../utils/jwt'

export class InstructorController {
  private instructorService: InstructorServices;
  private otpService: otpService;
  private otpGenerator: OtpGenerate;
  private sendEmail: SentEmail;
  private JWT:JwtService

  constructor() {
    this.instructorService = new InstructorServices();
    this.otpService = new otpService();
    this.otpGenerator = new OtpGenerate();
    this.sendEmail = new SentEmail();
    this.JWT = new JwtService()
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
        return res.json({
          success: false,
          message: "Existing user",
          user: ExistingInstructor,
        });
        throw new Error("errorr");
      } else {
        const otp = await this.otpGenerator.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        await this.sendEmail.sentEmailVerification(email, otp);

        const JWT = new JwtService();
        const token = await JWT.createToken({ email, password ,role:"instructor"});
        
      //   res.cookie('verification_token', 'token', {
      //     httpOnly: true,
      //     sameSite: 'none',
      //     expires: new Date(Date.now() + 300 * 60 * 1000)
      // })
        return res.status(201).json({
          success: true,
          message: "Signup successful, OTP sent to email",
          token,
        });
        // const token=await this.instructorService.signUp({email,password})
        // return res.status(200).json({
        //   success:true
        // })
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  public async resendOtp(req: Request, res: Response): Promise<any> {
    try {
      let { email } = req.body;
      console.log(email,"emaillllll")

      const otp = await this.otpGenerator.createOtpDigit();
      await this.otpService.createOtp(email, otp);

      await this.sendEmail.sentEmailVerification(email, otp);

      res.status(200).json({
        success:true,
        message:"Otp Sent to Email Succesfully!"
      })

    } catch (error:any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  public async createUser(req:Request,res:Response):Promise<any>{
    try {
      const {otp}=req.body
      console.log(req.headers,"headersssss")
      const token=req.headers['the-verify-token'] ||""
      console.log(token,"token")
      if(typeof token!='string'){
        throw new Error()
      }
      const decode= await this.JWT.verifyToken(token)
      console.log(decode,"decode")
      if (!decode) {
        return new Error( 'token has expired, register again')
    }
      const resultOtp=await this.otpService.findOtp(decode.email)
      console.log(resultOtp?.otp,"<>",otp)
      if(resultOtp?.otp===otp){
        console.log("matched")

        const user= await this.instructorService.createUser(decode)
        if(user){

          await this.otpService.deleteOtp(user.email)

          return res.status(201).json({
            success:true,
            message:"User Created Succesfully!",
            user
          })
        }


      }else{
        return res.json({
          success:false,
          message:"Wrong Otp"
        })
      }


      
    } catch (error:any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      console.log("Login request:", email);
  
      // Check if the instructor exists in the database
      const instructor = await this.instructorService.findByEmail(email);
      console.log(instructor,"instructor")
      
      if (!instructor) {
        return res.json({
          success: false,
          message: "invalid email id",
        });
      }
  
      // Compare the password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, instructor.password);
      console.log(isPasswordValid,"isPasswordValid")
      
      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Invalid Password",
        });
      }
      let role=instructor.role
      // Generate a JWT token if credentials are correct
      const token = await this.JWT.createToken({ email ,role });
  
      // Return the token in the response
      return res
                .status(200)
                .cookie('accessToken', token)
                // .cookie('refreshToken', userRefreshToken, {
                //     httpOnly: true
                // })
                .send({
                    success: true,
                    message: 'User Logged Successfully',
                    user: instructor
                })

  
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
        console.log('user logged out')
        res.clearCookie('accessToken')

        res.status(200).send({ success: true, message: 'logout success' })
    } catch (error: any) {
      throw error

    }
}
  
}
