import { IUser } from "../../models/userModel";
import { NextFunction, Request, Response } from "express";

export interface ICourseControllers {
  addCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourseById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getInstructorCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getFilteredInstructorCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  publishCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  buyCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBoughtCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getBoughtCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  coursePlay(req: Request, res: Response, next: NextFunction): Promise<void>;
  isBoughtCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  chapterVideoEnd(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  listOrUnlistCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getPaginatedCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getCourseCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  addStudent(payload: IUser): Promise<void>;

  // addQuiz(req: Request, res: Response, next:NextFunction):Promise<void>
  // editQuiz(req: Request, res: Response, next:NextFunction):Promise<void>
  // getQuiz(req: Request, res: Response, next:NextFunction):Promise<void>
  // submitResult(req: Request, res: Response, next:NextFunction):Promise<void>
}
