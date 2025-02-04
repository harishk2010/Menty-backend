import { Request, Response } from "express";

export interface IAdminControllers{
    login(req:Request,res:Response):Promise<void>
    logout(req:Request,res:Response):Promise<void>
}