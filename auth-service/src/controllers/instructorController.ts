import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { InstructorServices } from "../services/instructorServices";
import { OtpGenerate } from "../utils/otpGenerator";
import { JwtService } from "../utils/jwt";
import { IInstructor } from "../models/instructorModel";
import {
  access_token_options,
  refresh_token_options,
} from "../utils/tokenOptions";
import { NextFunction } from "http-proxy-middleware/dist/types";
import produce from "../config/kafka/producer";
import IInstructorControllers from "./interfaces/IInstructorController";
import IInstructorServices from "../services/interfaces/IIntstuctorServices";
import IOtpServices from "../services/interfaces/IOtpService";
// import  from '../utils/jwt'

export class InstructorController implements IInstructorControllers{
  private instructorService: IInstructorServices;
  private otpService: IOtpServices;
  private otpGenerator: OtpGenerate;
  private JWT: JwtService;

  constructor(instructorService: IInstructorServices,otpService: IOtpServices) {
    this.instructorService = instructorService
    this.otpService = otpService;
    this.otpGenerator = new OtpGenerate();

    this.JWT = new JwtService();
  }

  public async instructorSignUp(req: Request, res: Response): Promise<void> {
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
         res.json({
          success: false,
          message: "Existing user",
          user: ExistingInstructor,
        });
        return
        
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
         res.status(201).json({
          success: true,
          message: "Signup successful, OTP sent to email",
          token,
        });
        return
        // const token=await this.instructorService.signUp({email,password})
        // return res.status(200).json({
        //   success:true
        // })
      }
    } catch (error: any) {
      console.error(error);
       res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
 
  public async resendOtp(req: Request, res: Response): Promise<void> {
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

  public async createUser(req: Request, res: Response): Promise<void> {
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
        throw new Error("token has expired, register again");
      }
      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        console.log("matched");

        const user = await this.instructorService.createUser(decode);
        if (user) {
          await produce("add-instructor-data", user);
          await this.otpService.deleteOtp(user.email);

           res.status(201).json({
            success: true,
            message: "User Created Succesfully!",
            user,
          });
          return
        }
      } else {
         res.json({
          success: false,
          message: "Wrong Otp",
        });
        return
      }
    } catch (error: any) {
      console.error(error);
       res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
      
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log("Login request:", email);

      // Check if the instructor exists in the database
      const instructor = await this.instructorService.findByEmail(email);
      console.log(instructor, "instructor");

      if (!instructor) {
         res.json({
          success: false,
          message: "invalid email id",
        });
        return
      }

      // Compare the password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(
        password,
        instructor.password
      );
      

      if (!isPasswordValid) {
         res.json({
          success: false,
          message: "Invalid Password",
        });
        return
      }
      if(instructor.isBlocked){
         res.json({
         success:false,
         message:"instructor Blocked"
       })
       return
       
     }
      let role = instructor.role;
      let id = instructor._id;
      // Generate a JWT token if credentials are correct
      const accesstoken = await this.JWT.accessToken({ email, role ,id });
      const refreshToken = await this.JWT.refreshToken({ email, role ,id});

      // Return the token in the response
       
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
      
    } catch (error: any) {
      console.error(error);
       res.status(500).json({
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

  
  public async forgotResendOtp(req: Request, res: Response): Promise<void> {
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
       res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async resetPassword(req:Request,res:Response):Promise<void>{
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
      // throw new Error("Im the error thrown!")
      res.status(401).send({ success: false, message: "Invalid token. Please log in." });
      // throw new Error("Token expired")
      return 
    } catch (error: any) {
        console.error("Error in test method:", error.message);
        // throw error
        if (error.message === 'Token expired') {
            res.status(401).send({ success: false, message:error.message });
        } else {
            res.status(401).send({ success: false, message: "Invalid token. Please log in." });
        }
    }

      
  }

  async doGoogleLogin(req:Request,res:Response) {
    try {
        console.log("Google login in controller", req.body);
        
        const { name, email, password } = req.body;
      const ExistingInstructor=await this.instructorService.findByEmail(email)
      if (!ExistingInstructor) {
        const user = await this.instructorService.googleLogin(name, email, password);
        console.log(user, "User after creation in controller Google");
        
        if (user) {
          await produce("add-instructor-data", user);
          const role=user.role
          let id = user._id;
          const accesstoken = await this.JWT.accessToken({ email, role, id });
          const refreshToken = await this.JWT.refreshToken({ email, role, id });
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
async updatePassword(data: { email: string; password: string }): Promise<IInstructor | null> {
  try {
    console.log(data.email, data.password, "consumeeeeee");
    const passwordReset = await this.instructorService.resetPassword(
      data.email,
      data.password
    );
    return passwordReset;
  } catch (error) {
    console.log(error);
    throw error
  }
}

async updateProfile(data: { email: string; username: string ,profilePicUrl:string }): Promise<IInstructor | null> {
  try {
    const { email ,username, profilePicUrl} = data;
    console.log(data, "consumeeee");
    const response=await this.instructorService.updateProfile(email,{username, profilePicUrl})
 return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

async blockInstructor(data:{email:string,isBlocked:string}): Promise<IInstructor | null>{
  try {
    const {email,isBlocked}=data
    const response=await this.instructorService.updateProfile(email,{isBlocked})
 return response
  } catch (error) {
    console.log(error)
    throw error
  }
}
  

  
}
