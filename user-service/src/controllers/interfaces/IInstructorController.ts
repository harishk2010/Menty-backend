
import { InstructorUpdateStatus, InstructorWallet, ResetPassword } from "../../types/types";
import { IInstructor } from "../../models/instructorModel";
import { IUser } from "../../models/userModel";
import { NextFunction, Request, Response } from "express";

export interface IInstructorControllers {
    addInstructor(payload: IInstructor): Promise<void>;
    getInstructor(req: Request, res: Response): Promise<void>;
    getInstructorById(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    updatePassword(req: Request, res: Response): Promise<void>;
    getInstructors(req: Request, res: Response): Promise<void>;
    getTransactions(req: Request, res: Response): Promise<void>;
    blockInstructor(req: Request, res: Response): Promise<void>;
    updatePlanPrice(req: Request, res: Response): Promise<void>;
    getMentorExpertise(req: Request, res: Response, next: NextFunction): Promise<void>   
    passwordReset(data:ResetPassword): Promise<IInstructor | null>;
    updateWallet(data:InstructorWallet): Promise<IInstructor | null>;
    updateVerifyStatus(data:InstructorUpdateStatus): Promise<IInstructor | null>;
    approveRequest(data:{emailID:string,status:string}): Promise<IInstructor | null>;
    getPaginatedMentors(req: Request, res: Response, next: NextFunction): Promise<void>
}
