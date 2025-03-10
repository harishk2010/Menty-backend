import { Request, Response, NextFunction } from "express";

export interface IQuizController {
  addQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
  editQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
  getQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
  submitResult(req: Request, res: Response, next: NextFunction): Promise<void>;
}
