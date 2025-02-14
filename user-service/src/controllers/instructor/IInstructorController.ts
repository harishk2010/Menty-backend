
import { IInstructor } from "../../models/instructorModel";
import { IUser } from "../../models/userModel";
import { Request, Response } from "express";

export interface IInstructorControllers {
    addInstructor(payload: IInstructor): Promise<void>;
    getInstructor(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    updatePassword(req: Request, res: Response): Promise<void>;
    getInstructors(req: Request, res: Response): Promise<void>;
    blockInstructor(req: Request, res: Response): Promise<void>;
    passwordReset(data:any): Promise<IInstructor | null>;
    updateWallet(data:any): Promise<IInstructor | null>;
    updateVerifyStatus(data:any): Promise<IInstructor | null>;
    approveRequest(data:any): Promise<IInstructor | null>;
}
