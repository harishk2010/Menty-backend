import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { InstructorServices } from "../services/instructorServices";
import { OtpGenerate } from "../utils/otpGenerator";
import { otpService } from "../services/otpService";
import { SentEmail } from "../utils/senEmail";
import { JwtService } from "../utils/jwt";
import { IInstructor } from "../models/instructorModel";
import {
  access_token_options,
  refresh_token_options,
} from "../utils/tokenOptions";
import { SentForgotEmail } from "../utils/sendForgotPasswordEmail";
import { NextFunction } from "http-proxy-middleware/dist/types";
import produce from "../config/kafka/producer";
// import  from '../utils/jwt'

export class InstructorController {
  private instructorService: InstructorServices;
  private otpService: otpService;
  private otpGenerator: OtpGenerate;
  private sendEmail: SentEmail;
  private JWT: JwtService;
  private SentForgotEmail:SentForgotEmail

  constructor() {
    this.instructorService = new InstructorServices();
    this.otpService = new otpService();
    this.otpGenerator = new OtpGenerate();
    this.sendEmail = new SentEmail();
    this.SentForgotEmail=new SentForgotEmail()
    this.JWT = new JwtService();
  }

  public async instructorSignUp(req: Request, res: Response): Promise<any> {
    try {
      let { email, password ,username } = req.body;
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
        
      } else {
        const otp = await this.otpGenerator.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        produce('send-otp-email',{name:username,email,otp})

        const JWT = new JwtService();
        const token = await JWT.createToken({
          email,
          password,
          username,
          role: "instructor",
        });

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
      let { email ,username} = req.body;
      console.log(email, "emaillllll");

      const otp = await this.otpGenerator.createOtpDigit();
      await Promise.all([
        this.otpService.createOtp(email, otp),

        produce('send-otp-email',{name:username,email,otp})
      ]);
      res.status(200).json({
        success: true,
        message: "Otp Sent to Email Succesfully!",
      });
    } catch (error: any) {
      throw error;
    }
  }

  public async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { otp } = req.body;
      console.log(req.headers, "headersssss");
      const token = req.headers["the-verify-token"] || "";
      console.log(token, "token");
      if (typeof token != "string") {
        throw new Error();
      }
      const decode = await this.JWT.verifyToken(token);
      console.log(decode, "decode");
      if (!decode) {
        return new Error("token has expired, register again");
      }
      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        console.log("matched");

        const user = await this.instructorService.createUser(decode);
        if (user) {
          await produce("add-instructor", user);
          await this.otpService.deleteOtp(user.email);

          return res.status(201).json({
            success: true,
            message: "User Created Succesfully!",
            user,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Wrong Otp",
        });
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

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      console.log("Login request:", email);

      // Check if the instructor exists in the database
      const instructor = await this.instructorService.findByEmail(email);
      console.log(instructor, "instructor");

      if (!instructor) {
        return res.json({
          success: false,
          message: "invalid email id",
        });
      }

      // Compare the password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(
        password,
        instructor.password
      );
      

      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Invalid Password",
        });
      }
      if(instructor.isBlocked){
        return res.json({
         success:false,
         message:"instructor Blocked"
       })
       
     }
      let role = instructor.role;
      // Generate a JWT token if credentials are correct
      const accesstoken = await this.JWT.accessToken({ email, role });
      const refreshToken = await this.JWT.refreshToken({ email, role });

      // Return the token in the response
      return (
        res
          .status(200)
          .cookie("accessToken", accesstoken,{ httpOnly: true })
          .cookie("refreshToken", refreshToken,{ httpOnly: true })
          // .cookie('refreshToken', userRefreshToken, {
          //     httpOnly: true
          // })
          .send({
            success: true,
            message: "User Logged Successfully",
            user: instructor,
            token:{accesstoken,refreshToken}
          })
      );
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
      console.log("user logged out");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).send({ success: true, message: "logout success" });
    } catch (error: any) {
      throw error;
    }
  }
  async verifyEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      let existingUser = await this.instructorService.findByEmail(email);
      console.log(existingUser,"existingUser")
      if (existingUser) {
        const otp = await this.otpGenerator.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        produce('send-forgotPassword-email',{email,otp})
        res.send({
          success: true,
          message: "Rediercting To OTP Page",
          data:existingUser
        });
        
      }else{
        res.send({
          success: false,
          message: "No User Found",
        });

      }

      
    } catch (error: any) {
      throw error;
    }
  }

  async verifyResetOtp(req:Request,res:Response){
    try {
      const { email, otp }=req.body
      const resultOtp = await this.otpService.findOtp(email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        console.log("matched");
        let token= await this.JWT.createToken({email})
         res.status(200)
        .cookie("forgotToken",token)
        .json({
          success:true,
          message:"Redirecting to Reset Password Page",
        })
      }else{
         res.json({
          success:false,
          message:"Otp didn't match"
        })
      }

      
    } catch (error) {
      throw error
      
    }
  }

  
  public async forgotResendOtp(req: Request, res: Response): Promise<any> {
    try {
      let { email } = req.body;
      console.log(email, "emaillllll");

      const otp = await this.otpGenerator.createOtpDigit();
      await this.otpService.createOtp(email, otp);

      produce('send-forgotPassword-email',{email,otp})

      res.status(200).json({
        success: true,
        message: "Otp Sent to Email Succesfully!",
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async resetPassword(req:Request,res:Response){
    try {
      const { password }=req.body
      const hashedPassword= await bcrypt.hash(password,10)
      console.log(hashedPassword)
      // console.log(req.cookies.forgotToken)
      const token=req.cookies.forgotToken
      let data=await this.JWT.verifyToken(token)
      if(!data){
        throw new Error("Token expired retry reset password")
      }
 
      const passwordReset= await this.instructorService.resetPassword(data.email,hashedPassword)
      if(passwordReset){
        res.clearCookie('forgotToken')
        res.status(200).json({
          success:true,
          message:"Password changed !",
        })
      }
      
    } catch (error) {
      throw error
      
    }
  }

  async test(req:Request,res:Response){
    try {
      const acc = await this.JWT.verifyToken(req.cookies["accessToken"]);
        console.log(acc, "tester access");

        res.status(200).send({ success: true, message: "hey instructor" });
    } catch (error: any) {
        console.error("Error in test method:", error.message);
        if (error.message === 'Token expired') {
            res.status(401).send({ success: false, message: "Token expired. Please log in again." });
        } else {
            res.status(400).send({ success: false, message: "Invalid token. Please log in." });
        }
    }

      
  }

  async doGoogleLogin(req:Request,res:Response) {
    try {
        console.log("Google login in controller", req.body);
        
        const { name, email, password } = req.body;
      const ExistingInstructor=await this.instructorService.findByEmail(email)
      if (!ExistingInstructor) {
        const user: any = await this.instructorService.googleLogin(name, email, password);
        console.log(user, "User after creation in controller Google");
        
        if (user) {
          await produce("add-instructor", user);
          console.log(user.token, "User token");
          const role=user.role
          const accesstoken = await this.JWT.accessToken({ email, role });
          const refreshToken = await this.JWT.refreshToken({ email, role });
          console.log(accesstoken,"-----",refreshToken)
          
          
          res.status(200)
          .cookie("accessToken", accesstoken,{ httpOnly: true })
          .cookie("refreshToken", refreshToken,{ httpOnly: true })
          .json({
            success:true,
            message:"Logging in with GOOOOGLE",
            user:user
            
          });
        }
      }else{
        if(!ExistingInstructor.isBlocked){

        
          const role = ExistingInstructor.role;
          const id = ExistingInstructor._id;
          const accesstoken = await this.JWT.accessToken({ id, email, role });
          const refreshToken = await this.JWT.refreshToken({ id, email, role });
          console.log(accesstoken, "-----", refreshToken);
  
          res
            .status(200)
            .cookie("accessToken", accesstoken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({
              success: true,
              message: "Logging in with GOOOOGLE",
              user: ExistingInstructor,
            });
          }else{
            res
            .status(200)
            
            .json({
              success: false,
              message: "User Blocked",
              user: ExistingInstructor,
            });
          }

      }
      
       
    } catch (error: any) {
        throw error;
    }
}
async updatePassword(data: { email: string; password: string }) {
  try {
    console.log(data.email, data.password, "consumeeeeee");
    const passwordReset = await this.instructorService.resetPassword(
      data.email,
      data.password
    );
    return passwordReset;
  } catch (error) {
    console.log(error);
  }
}

async updateProfile(data: any) {
  try {
    const { email ,username, profilePicUrl} = data;
    console.log(data, "consumeeee");
    const response=await this.instructorService.updateProfile(email,{username, profilePicUrl})
  } catch (error) {
    console.log(error);
  }
}

async blockInstructor(data:any){
  try {
    const {email,isBlocked}=data
    const response=await this.instructorService.updateProfile(email,{isBlocked})
  } catch (error) {
    console.log(error)
  }
}
  

  
}
