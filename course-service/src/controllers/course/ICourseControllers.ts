
import { NextFunction, Request, Response } from "express";

export interface ICourseControllers {
    addCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    updateCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllCourses(req:Request,res:Response,next:NextFunction):Promise<void>
    getCourseById(req:Request,res:Response,next:NextFunction):Promise<void>
    getInstructorCourses(req:Request,res:Response,next:NextFunction):Promise<void>
    publishCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    buyCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    getBoughtCourses(req:Request,res:Response,next:NextFunction):Promise<void>
    coursePlay(req: Request, res: Response, next:NextFunction):Promise<any>
    chapterVideoEnd(req: Request, res: Response, next:NextFunction):Promise<void>
    // addQuiz(req: Request, res: Response, next:NextFunction):Promise<void>
    // editQuiz(req: Request, res: Response, next:NextFunction):Promise<void>
    // getQuiz(req: Request, res: Response, next:NextFunction):Promise<void>
    // submitResult(req: Request, res: Response, next:NextFunction):Promise<void>
  
}
