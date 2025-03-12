import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OtpGenerate } from "../utils/otpGenerator";
import { JwtService } from "../utils/jwt";
import { IInstructor } from "../models/instructorModel";
import produce from "../config/kafka/producer";
import IInstructorControllers from "../services/interfaces/IInstructorController";
import IInstructorServices from "../services/interfaces/IIntstuctorServices";
import IOtpServices from "../services/interfaces/IOtpService";
import {
  InstructorErrorMessages,
  InstructorSuccessMessages,
} from "../utils/constants";
import { Roles, StatusCode } from "../utils/enums";
// import  from '../utils/jwt'

export class InstructorController implements IInstructorControllers {
  private instructorService: IInstructorServices;
  private otpService: IOtpServices;
  private otpGenerator: OtpGenerate;
  private JWT: JwtService;

  constructor(
    instructorService: IInstructorServices,
    otpService: IOtpServices
  ) {
    this.instructorService = instructorService;
    this.otpService = otpService;
    this.otpGenerator = new OtpGenerate();

    this.JWT = new JwtService();
  }

  public async instructorSignUp(req: Request, res: Response): Promise<void> {
    try {
      let { email, password, username } = req.body;

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      password = hashedPassword;

      const ExistingInstructor = await this.instructorService.findByEmail(
        email
      );

      if (ExistingInstructor) {
        res.json({
          success: false,
          message: InstructorErrorMessages.USER_ALREADY_EXISTS,
          user: ExistingInstructor,
        });
        return;
      } else {
        const otp = await this.otpGenerator.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        produce("send-otp-email", { name: username, email, otp });

        const JWT = new JwtService();
        const token = await JWT.createToken({
          email,
          password,
          username,
          role: Roles.INSTRUCTOR,
        });

        res.status(StatusCode.CREATED).json({
          success: true,
          message: InstructorSuccessMessages.SIGNUP_SUCCESS,
          token,
        });
        return;
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      let { email, username } = req.body;

      const otp = await this.otpGenerator.createOtpDigit();
      await Promise.all([
        this.otpService.createOtp(email, otp),

        produce("send-otp-email", { name: username, email, otp }),
      ]);
      res.status(StatusCode.OK).json({
        success: true,
        message: InstructorSuccessMessages.OTP_SENT,
      });
    } catch (error: any) {
      throw error;
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { otp } = req.body;

      const token = req.headers["the-verify-token"] || "";

      if (typeof token != "string") {
        throw new Error();
      }
      const decode = await this.JWT.verifyToken(token);

      if (!decode) {
        throw new Error(InstructorErrorMessages.TOKEN_INVALID);
      }
      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        const user = await this.instructorService.createUser(decode);
        if (user) {
          await produce("add-instructor-data", user);
          await this.otpService.deleteOtp(user.email);

          res.status(StatusCode.CREATED).json({
            success: true,
            message: InstructorSuccessMessages.USER_CREATED,
            user,
          });
          return;
        }
      } else {
        res.json({
          success: false,
          message: InstructorErrorMessages.INCORRECT_OTP,
        });
        return;
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if the instructor exists in the database
      const instructor = await this.instructorService.findByEmail(email);

      if (!instructor) {
        res.json({
          success: false,
          message: InstructorErrorMessages.USER_NOT_FOUND,
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        instructor.password
      );

      if (!isPasswordValid) {
        res.json({
          success: false,
          message: InstructorErrorMessages.INVALID_CREDENTIALS,
        });
        return;
      }
      if (instructor.isBlocked) {
        res.json({
          success: false,
          message: InstructorErrorMessages.INTERNAL_SERVER_ERROR,
        });
        return;
      }
      let role = instructor.role;
      let id = instructor._id;

      const accesstoken = await this.JWT.accessToken({ email, role, id });
      const refreshToken = await this.JWT.refreshToken({ email, role, id });

      res
        .status(StatusCode.OK)
        .cookie("accessToken", accesstoken, { httpOnly: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true })

        .send({
          success: true,
          message: InstructorSuccessMessages.LOGIN_SUCCESS,
          user: instructor,
          token: { accesstoken, refreshToken },
        });
    } catch (error: any) {
      throw error;
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res
        .status(StatusCode.OK)
        .send({
          success: true,
          message: InstructorSuccessMessages.LOGOUT_SUCCESS,
        });
    } catch (error: any) {
      throw error;
    }
  }
  async verifyEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      let existingUser = await this.instructorService.findByEmail(email);

      if (existingUser) {
        const otp = await this.otpGenerator.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        produce("send-forgotPassword-email", { email, otp });
        res.send({
          success: true,
          message: InstructorSuccessMessages.REDIERCTING_OTP_PAGE,
          data: existingUser,
        });
      } else {
        res.send({
          success: false,
          message: InstructorErrorMessages.USER_NOT_FOUND,
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
          message: InstructorSuccessMessages.REDIERCTING_PASSWORD_RESET_PAGE,
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

  public async forgotResendOtp(req: Request, res: Response): Promise<void> {
    try {
      let { email } = req.body;

      const otp = await this.otpGenerator.createOtpDigit();
      await this.otpService.createOtp(email, otp);

      produce("send-forgotPassword-email", { email, otp });

      res.status(StatusCode.OK).json({
        success: true,
        message: InstructorSuccessMessages.OTP_SENT,
      });
    } catch (error: any) {
      throw error;
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const token = req.cookies.forgotToken;
      let data = await this.JWT.verifyToken(token);
      if (!data) {
        throw new Error(InstructorErrorMessages.TOKEN_INVALID);
      }

      const passwordReset = await this.instructorService.resetPassword(
        data.email,
        hashedPassword
      );
      if (passwordReset) {
        res.clearCookie("forgotToken");
        res.status(StatusCode.OK).json({
          success: true,
          message: InstructorSuccessMessages.PASSWORD_RESET,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async test(req: Request, res: Response) {
    try {
      res
        .status(401)
        .send({ success: false, message: "Invalid token. Please log in." });

      return;
    } catch (error: any) {
      console.error("Error in test method:", error.message);
      // throw error
      if (error.message === "Token expired") {
        res.status(401).send({ success: false, message: error.message });
      } else {
        res
          .status(401)
          .send({ success: false, message: "Invalid token. Please log in." });
      }
    }
  }

  async doGoogleLogin(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const ExistingInstructor = await this.instructorService.findByEmail(
        email
      );
      if (!ExistingInstructor) {
        const user = await this.instructorService.googleLogin(
          name,
          email,
          password
        );

        if (user) {
          await produce("add-instructor-data", user);
          const role = user.role;
          let id = user._id;
          const accesstoken = await this.JWT.accessToken({ email, role, id });
          const refreshToken = await this.JWT.refreshToken({ email, role, id });

          res
            .status(StatusCode.OK)
            .cookie("accessToken", accesstoken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({
              success: true,
              message: InstructorSuccessMessages.GOOGLE_LOGIN_SUCCESS,
              user: user,
            });
        }
      } else {
        if (!ExistingInstructor.isBlocked) {
          const role = ExistingInstructor.role;
          const id = ExistingInstructor._id;
          const accesstoken = await this.JWT.accessToken({ id, email, role });
          const refreshToken = await this.JWT.refreshToken({ id, email, role });

          res
            .status(StatusCode.OK)
            .cookie("accessToken", accesstoken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({
              success: true,
              message: InstructorSuccessMessages.GOOGLE_LOGIN_SUCCESS,
              user: ExistingInstructor,
            });
        } else {
          res
            .status(StatusCode.CONFLICT)

            .json({
              success: false,
              message: InstructorErrorMessages.INTERNAL_SERVER_ERROR,
              user: ExistingInstructor,
            });
        }
      }
    } catch (error: any) {
      throw error;
    }
  }
  async updatePassword(data: {
    email: string;
    password: string;
  }): Promise<IInstructor | null> {
    try {
      const passwordReset = await this.instructorService.resetPassword(
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
  }): Promise<IInstructor | null> {
    try {
      const { email, username, profilePicUrl } = data;
      const response = await this.instructorService.updateProfile(email, {
        username,
        profilePicUrl,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async blockInstructor(data: {
    email: string;
    isBlocked: string;
  }): Promise<IInstructor | null> {
    try {
      const { email, isBlocked } = data;
      const response = await this.instructorService.updateProfile(email, {
        isBlocked,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
