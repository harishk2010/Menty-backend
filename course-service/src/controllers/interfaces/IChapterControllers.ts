
import { NextFunction, Request, Response } from "express";

export interface IChapterControllers {
    addChapter(req:Request,res:Response,next:NextFunction):Promise<void>
    updateChapter(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllChapters(req:Request,res:Response,next:NextFunction):Promise<void>
    getChapterById(req:Request,res:Response,next:NextFunction):Promise<void>
  
}
