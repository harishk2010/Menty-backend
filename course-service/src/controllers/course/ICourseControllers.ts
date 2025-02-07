
import { NextFunction, Request, Response } from "express";

export interface ICourseControllers {
    addCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllCourses(req:Request,res:Response,next:NextFunction):Promise<void>
    getCourseById(req:Request,res:Response,next:NextFunction):Promise<void>
  
}
