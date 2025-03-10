import { NextFunction, Request, Response } from "express";

export interface IMentorReviewController {
  createReview(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMentorReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
