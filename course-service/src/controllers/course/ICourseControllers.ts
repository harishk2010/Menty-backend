
import { NextFunction, Request, Response } from "express";

export interface ICourseControllers {
    addCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    updateCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllCourses(req:Request,res:Response,next:NextFunction):Promise<void>
    getCourseById(req:Request,res:Response,next:NextFunction):Promise<void>
    publishCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    buyCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    getBoughtCourses(req:Request,res:Response,next:NextFunction):Promise<void>
    coursePlay(req: Request, res: Response):Promise<any>
  
}
