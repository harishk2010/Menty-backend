import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { StudentServices } from "../services/studentServices";
import { OtpGenerate } from "../utils/otpGenerator";
import { otpService } from "../services/otpService";
import { SentEmail } from "../utils/senEmail";
import { JwtService } from "../utils/jwt";
import { IUser } from "@/models/userModel";
import {
  access_token_options,
  refresh_token_options,
} from "../utils/tokenOptions";
import { SentForgotEmail } from "../utils/sendForgotPasswordEmail";
import { NextFunction } from "http-proxy-middleware/dist/types";
import produce from "../config/kafka/producer";
// import  from '../utils/jwt'

export class StudentController {
  private studentService: StudentServices;
  private otpService: otpService;
  private otpGenerator: OtpGenerate;
  private sendEmail: SentEmail;
  private JWT: JwtService;
  private SentForgotEmail: SentForgotEmail;

  constructor() {
    this.studentService = new StudentServices();
    this.otpService = new otpService();
    this.otpGenerator = new OtpGenerate();
    this.sendEmail = new SentEmail();
    this.SentForgotEmail = new SentForgotEmail();
    this.JWT = new JwtService();
  }

  public async studentSignUp(req: Request, res: Response): Promise<any> {
    try {
      let { email, password, username } = req.body;
      console.log(email, password);

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      password = hashedPassword;

      const ExistingStudent = await this.studentService.findByEmail(email);

      console.log(ExistingStudent, "ExistingStudent");

      if (ExistingStudent) {
        return res.json({
          success: false,
          message: "Existing user",
          user: ExistingStudent,
        });
        // throw new Error("errorr");
      } else {
        const otp = await this.otpGenerator.createOtpDigit();
        
          await  this.otpService.createOtp(email, otp),

          produce('send-otp-email',{name:username,email,otp})
       

        const token = await this.JWT.createToken({
          email,
          password,
          username,
          role: "student",
        });

        return res.status(201).json({
          success: true,
          message: "Signup successful, OTP sent to email",
          token,
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

  public async resendOtp(req: Request, res: Response): Promise<any> {
    try {
      let { email ,username} = req.body;

      const otp = await this.otpGenerator.createOtpDigit();
      await  this.otpService.createOtp(email, otp),

          produce('send-otp-email',{name:username,email,otp})
       

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
      // console.log(otp,"otppp student")
      // console.log(req.headers, "headersssss");
      const token = req.headers["the-verify-token"] || "";
      // console.log(token, "token");
      if (typeof token != "string") {
        throw new Error();
      }
      const decode = await this.JWT.verifyToken(token);
      // console.log(decode, "decode student token");
      if (!decode) {
        return new Error("token has expired, register again");
      }
      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        // console.log("matched");

        const user = await this.studentService.createUser(decode);

        if (user) {
          await produce("add-student", user);
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
      console.log(req.body);
      const student = await this.studentService.findByEmail(email);
      console.log(student, "student");
  
      if (!student) {
        return res.json({
          success: false,
          message: "Invalid email ID",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, student.password);
  
      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Invalid Password",
        });
      }
  
      if (student.isBlocked) {
        return res.json({
          success: false,
          message: "User Blocked",
        });
      }
  
      let role = student.role;
      let id = student._id;
      const accesstoken = await this.JWT.accessToken({ id, email, role });
      const refreshToken = await this.JWT.refreshToken({ id, email, role });
  
      // Return the token in the response
      return res
        .status(200)
        .cookie("accessToken", accesstoken, { httpOnly: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .send({
          success: true,
          message: "User Logged Successfully",
          user: student,
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
  

  async logout(req: Request, res: Response) {
    try {
      console.log("Student logged out");
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
      let existingUser = await this.studentService.findByEmail(email);
      console.log(existingUser, "existingStudent");
      if (existingUser) {
        const otp = await this.otpGenerator.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        // await this.SentForgotEmail.sentEmailVerification(email, otp);
        produce('send-forgotPassword-email',{email,otp})
        res.send({
          success: true,
          message: "Rediercting To OTP Page",
          data: existingUser,
        });
      } else {
        res.send({
          success: false,
          message: "No User Found",
        });
      }
    } catch (error: any) {
      throw error;
    }
  }

  async verifyResetOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const resultOtp = await this.otpService.findOtp(email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        console.log("matched");
        let token = await this.JWT.createToken({ email });
        res.status(200).cookie("forgotToken", token).json({
          success: true,
          message: "Redirecting to Reset Password Page",
        });
      } else {
        res.json({
          success: false,
          message: "Otp didn't match",
        });
      }
    } catch (error) {
      throw error;
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

  async resetPassword(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      // console.log(req.cookies.forgotToken)
      const token = req.cookies.forgotToken;
      let data = await this.JWT.verifyToken(token);
      if (!data) {
        throw new Error("Token expired retry reset password");
      }

      const passwordReset = await this.studentService.resetPassword(
        data.email,
        hashedPassword
      );
      if (passwordReset) {
        await produce('password-reset-student',passwordReset)
        res.clearCookie("forgotToken");
        res.status(200).json({
          success: true,
          message: "Password changed !",
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async test(req: Request, res: Response) {
    try {
      console.log("testing.............");
      const acc = await this.JWT.verifyToken(req.cookies["accessToken"]);
      console.log(acc, "tester access");
      res.send({ success: true });
    } catch (error) {
      throw error;
    }
  }

  async doGoogleLogin(req: Request, res: Response) {
    try {
      console.log("Google login in controller", req.body);

      const { name, email, password } = req.body;
      const existingStudent = await this.studentService.findByEmail(email);
      if (!existingStudent) {
        const user: any = await this.studentService.googleLogin(
          name,
          email,
          password
        );
        console.log(user, "User after creation in controller Google");

        if (user) {
          await produce("add-student", user);
          console.log(user.token, "User token");
          const role = user.role;
          const accesstoken = await this.JWT.accessToken({ email, role });
          const refreshToken = await this.JWT.refreshToken({ email, role });
          console.log(accesstoken, "-----", refreshToken);

          res
            .status(200)
            .cookie("accessToken", accesstoken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({
              success: true,
              message: "Logging in with GOOOOGLE",
              user: user,
            });
        }
      } else {
        if(!existingStudent.isBlocked){

        
        const role = existingStudent.role;
        const id = existingStudent._id;
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
            user: existingStudent,
          });
        }else{
          res
          .status(200)
          
          .json({
            success: false,
            message: "User Blocked",
            user: existingStudent,
          });
        }
      }
    } catch (error: any) {
      throw error;
    }
  }

  //consumed kafka codes
  async updatePassword(data: { email: string; password: string }) {
    try {
      console.log(data.email, data.password, "consumeeeeee");
      const passwordReset = await this.studentService.resetPassword(
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
      const response=await this.studentService.updateProfile(email,{username, profilePicUrl})
    } catch (error) {
      console.log(error);
    }
  }

  async blockStudent(data:any){
    try {
      const {email,isBlocked}=data
      const response=await this.studentService.updateProfile(email,{isBlocked})
    } catch (error) {
      console.log(error)
    }
  }
}
