import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OtpGenerate } from "../utils/otpGenerator";
import { JwtService } from "../utils/jwt";
import { IUser } from "../models/userModel";
import produce from "../config/kafka/producer";
import IStudentServices from "../services/interfaces/IStudentServices";
import IStudentControllers from "./interfaces/IStudentControllers";
import IOtpServices from "../services/interfaces/IOtpService";

export class StudentController implements IStudentControllers {
  private studentService: IStudentServices;
  private otpService: IOtpServices;

  private otpGenerator: OtpGenerate;
  private JWT: JwtService;

  constructor(studentService: IStudentServices, otpService: IOtpServices) {
    this.studentService = studentService;
    this.otpService = otpService;

    this.otpGenerator = new OtpGenerate();

    this.JWT = new JwtService();
  }

  public async studentSignUp(req: Request, res: Response): Promise<any> {
    try {
      let { email, password, username } = req.body;

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      password = hashedPassword;

      const ExistingStudent = await this.studentService.findByEmail(email);

      if (ExistingStudent) {
        return res.json({
          success: false,
          message: "Existing user",
          user: ExistingStudent,
        });
      } else {
        const otp = await this.otpGenerator.createOtpDigit();

        await this.otpService.createOtp(email, otp),
          produce("send-otp-email", { name: username, email, otp });

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
      let { email, username } = req.body;

      const otp = await this.otpGenerator.createOtpDigit();
      await this.otpService.createOtp(email, otp),
        produce("send-otp-email", { name: username, email, otp });

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

      const token = req.headers["the-verify-token"] || "";
      if (typeof token != "string") {
        throw new Error();
      }
      const decode = await this.JWT.verifyToken(token);
      if (!decode) {
        return new Error("token has expired, register again");
      }
      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
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
      const student = await this.studentService.findByEmail(email);

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
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).send({ success: true, message: "logout success" });
    } catch (error: any) {
      throw error;
    }
  }
  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      let existingUser = await this.studentService.findByEmail(email);
      if (existingUser) {
        const otp = await this.otpGenerator.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        produce("send-forgotPassword-email", { email, otp });
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

      const otp = await this.otpGenerator.createOtpDigit();
      await this.otpService.createOtp(email, otp);

      produce("send-forgotPassword-email", { email, otp });

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
        await produce("password-reset-student", passwordReset);
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
      const acc = await this.JWT.verifyToken(req.cookies["accessToken"]);
      res.send({ success: true });
    } catch (error) {
      throw error;
    }
  }

  async doGoogleLogin(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const existingStudent = await this.studentService.findByEmail(email);
      if (!existingStudent) {
        const user = await this.studentService.googleLogin(
          name,
          email,
          password
        );

        if (user) {
          await produce("add-student", user);

          const role = user.role;
          const accesstoken = await this.JWT.accessToken({ email, role });
          const refreshToken = await this.JWT.refreshToken({ email, role });

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
        if (!existingStudent.isBlocked) {
          const role = existingStudent.role;
          const id = existingStudent._id;
          const accesstoken = await this.JWT.accessToken({ id, email, role });
          const refreshToken = await this.JWT.refreshToken({ id, email, role });

          res
            .status(200)
            .cookie("accessToken", accesstoken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({
              success: true,
              message: "Logging in with GOOOOGLE",
              user: existingStudent,
            });
        } else {
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
  async updatePassword(data: {
    email: string;
    password: string;
  }): Promise<IUser | null> {
    try {
      const passwordReset = await this.studentService.resetPassword(
        data.email,
        data.password
      );
      return passwordReset;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(data: {
    email: string;
    username: string;
    profilePicUrl: string;
  }): Promise<IUser | null> {
    try {
      const { email, username, profilePicUrl } = data;
      const response = await this.studentService.updateProfile(email, {
        username,
        profilePicUrl,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async blockStudent(data: {
    email: string;
    isBlocked: string;
  }): Promise<IUser | null> {
    try {
      const { email, isBlocked } = data;
      const response = await this.studentService.updateProfile(email, {
        isBlocked,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
