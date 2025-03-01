

import { IUser } from "../../models/userModel";
import { Request, Response } from "express";

export interface IStudentControllers {
    addStudent(payload: IUser): Promise<void>;
    getStudent(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    updatePassword(req: Request, res: Response): Promise<void>;
    getStudents(req: Request, res: Response): Promise<void>;
    searchStudents(req: Request, res: Response): Promise<void>;
    getStudentDataById(req: Request, res: Response): Promise<void>;
    blockStudent(req: Request, res: Response): Promise<void>;
    passwordReset(data:any): Promise<IUser | null>;
   
}
