import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OtpGenerate } from "../utils/otpGenerator";
import { JwtService } from "../utils/jwt";
import { IUser } from "../models/userModel";
import produce from "../config/kafka/producer";
import IStudentServices from "../services/interfaces/IStudentServices";
import IStudentControllers from "./interfaces/IStudentControllers";
import IOtpServices from "../services/interfaces/IOtpService";
import { InstructorErrorMessages, StudentErrorMessages, StudentSuccessMessages } from "../utils/constants";
import { Roles, StatusCode } from "../utils/enums";

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
          message: StudentErrorMessages.USER_ALREADY_EXISTS,
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
          role: Roles.STUDENT,
        });

        return res.status(StatusCode.CREATED).json({
          success: true,
          message: StudentSuccessMessages.SIGNUP_SUCCESS,
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

      res.status(StatusCode.OK).json({
        success: true,
        message: StudentSuccessMessages.OTP_SENT,
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
        return new Error(StudentErrorMessages.TOKEN_INVALID);
      }
      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        const user = await this.studentService.createUser(decode);

        if (user) {
          await produce("add-student", user);
          await this.otpService.deleteOtp(user.email);

          return res.status(StatusCode.CREATED).json({
            success: true,
            message: StudentSuccessMessages.USER_CREATED,
            user,
          });
        }
      } else {
        return res.json({
          success: false,
          message: StudentErrorMessages.INCORRECT_OTP,
        });
      }
    } catch (error: any) {
      throw error
    }
  }

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      const student = await this.studentService.findByEmail(email);

      if (!student) {
        return res.json({
          success: false,
          message: StudentErrorMessages.INVALID_CREDENTIALS,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, student.password);

      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: StudentErrorMessages.INVALID_CREDENTIALS,
        });
      }

      if (student.isBlocked) {
        return res.json({
          success: false,
          message: StudentErrorMessages.INTERNAL_SERVER_ERROR,
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

      res.status(StatusCode.OK).send({ success: true, message: StudentSuccessMessages.LOGOUT_SUCCESS });
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
          message: StudentSuccessMessages.REDIERCTING_OTP_PAGE,
          data: existingUser,
        });
      } else {
        res.send({
          success: false,
          message: StudentErrorMessages.USER_NOT_FOUND,
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
        res.status(StatusCode.OK).cookie("forgotToken", token).json({
          success: true,
          message: StudentSuccessMessages.REDIERCTING_PASSWORD_RESET_PAGE,
        });
      } else {
        res.json({
          success: false,
          message: InstructorErrorMessages.INCORRECT_OTP,
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

      res.status(StatusCode.OK).json({
        success: true,
        message: StudentSuccessMessages.OTP_SENT,
      });
    } catch (error: any) {
      throw error
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = req.cookies.forgotToken;
      let data = await this.JWT.verifyToken(token);
      if (!data) {
        throw new Error(StudentErrorMessages.TOKEN_INVALID);
      }

      const passwordReset = await this.studentService.resetPassword(
        data.email,
        hashedPassword
      );
      if (passwordReset) {
        await produce("password-reset-student", passwordReset);
        res.clearCookie("forgotToken");
        res.status(StatusCode.OK).json({
          success: true,
          message: StudentSuccessMessages.PASSWORD_RESET,
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
            .status(StatusCode.OK)
            .cookie("accessToken", accesstoken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({
              success: true,
              message: StudentSuccessMessages.GOOGLE_LOGIN_SUCCESS,
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
              message:StudentSuccessMessages.GOOGLE_LOGIN_SUCCESS,
              user: existingStudent,
            });
        } else {
          res
            .status(StatusCode.OK)

            .json({
              success: false,
              message: StudentErrorMessages.INTERNAL_SERVER_ERROR,
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
