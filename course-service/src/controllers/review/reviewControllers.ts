import { NextFunction, Request, Response } from "express";
import { IReviewService } from "../../services/interfaces/IReviewService";
import getId from "../../utils/getId";
import { IReviewController } from "../interfaces/IReviewControllers";
import { StatusCode } from "@/utils/enums";
import { ReviewErrorMessages, ReviewSuccessMessages } from "@/utils/constants";

export class ReviewController implements IReviewController {
  private reviewService: IReviewService;
  constructor(reviewService: IReviewService) {
    this.reviewService = reviewService;
  }

  async createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId, rating, comment } = req.body;
      const userId = await getId("accessToken", req);

      const newReview = await this.reviewService.createReview(
        String(userId),
        courseId,
        rating,
        comment
      );
      if (newReview) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: ReviewSuccessMessages.REVIEW_CREATED,
          data: newReview,
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message:ReviewErrorMessages.SOMETHING_WENT_WRONG,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getCourseReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      const reviews = await this.reviewService.getReviewsByCourse(courseId);
      const averageRating = await this.reviewService.getAverageRating(courseId);

      res.status(StatusCode.OK).json({
        success: true,
        message: ReviewSuccessMessages.COURSE_REVIEWS_RETRIEVED,
        data: {
          reviews,
          averageRating,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
