
import { NextFunction, Request, Response } from "express";

export interface ICourseControllers {
    addCourse(req:Request,res:Response,next:NextFunction):Promise<void>
  
}
