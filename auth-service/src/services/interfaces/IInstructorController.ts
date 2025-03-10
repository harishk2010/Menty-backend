import { IInstructor } from "../../models/instructorModel";
import { Request, Response } from "express";

export default interface IInstructorControllers {
  instructorSignUp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  createUser(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  verifyEmail(req: Request, res: Response): Promise<void>;
  verifyResetOtp(req: Request, res: Response): Promise<void>;
  forgotResendOtp(req: Request, res: Response): Promise<void>;
  test(req: Request, res: Response): Promise<void>;
  doGoogleLogin(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  updatePassword(data: {
    email: string;
    password: string;
  }): Promise<IInstructor | null>;
  updateProfile(data: {
    email: string;
    username: string;
    profilePicUrl: string;
  }): Promise<IInstructor | null>;
  blockInstructor(data: {
    email: string;
    isBlocked: string;
  }): Promise<IInstructor | null>;
}
