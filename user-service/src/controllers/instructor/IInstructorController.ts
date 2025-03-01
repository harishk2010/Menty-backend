
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
    passwordReset(data:any): Promise<IInstructor | null>;
    updateWallet(data:any): Promise<IInstructor | null>;
    updateVerifyStatus(data:any): Promise<IInstructor | null>;
    approveRequest(data:any): Promise<IInstructor | null>;
    getPaginatedMentors(req: Request, res: Response, next: NextFunction): Promise<void>
}
