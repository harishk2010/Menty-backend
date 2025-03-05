import { NextFunction, Request, Response } from "express";


export default interface ISlotController{
    createSlots(req:Request,res:Response,next:NextFunction):Promise<void>
    getInstructorSlots(req:Request,res:Response,next:NextFunction):Promise<void>
    getSlotById(req:Request,res:Response,next:NextFunction):Promise<void>
    deleteSlot(req:Request,res:Response,next:NextFunction):Promise<void>
}