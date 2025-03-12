import { NextFunction, Request, Response } from "express";
import { IMentorReviewService } from "../../services/interfaces/IMentorReviewService";
import getId from "../../utils/getId";
import { IMentorReviewController } from "../interfaces/IMentorReviewController";
import { StatusCode } from "@/utils/enums";
import { MentorReviewErrorMessages, MentorReviewSuccessMessages } from "@/utils/constants";

export class MentorReviewController implements IMentorReviewController {
  private mentorReviewService: IMentorReviewService;

  constructor(mentorReviewService: IMentorReviewService) {
    this.mentorReviewService = mentorReviewService;
  }

  async createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { mentorId, rating, comment } = req.body;
      const userId = await getId("accessToken", req);

      const newReview = await this.mentorReviewService.createReview(
        String(userId),
        mentorId,
        rating,
        comment
      );

      if (newReview) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: MentorReviewSuccessMessages.REVIEW_CREATED,
          data: newReview,
        });
      } else {
        res.json({
          success: false,
          message: MentorReviewErrorMessages.REVIEW_CREATION_FAILED,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getMentorReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { mentorId } = req.params;

      const reviews = await this.mentorReviewService.getReviewsByMentor(
        mentorId
      );
      const averageRating = await this.mentorReviewService.getAverageRating(
        mentorId
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: MentorReviewSuccessMessages.MENTOR_REVIEWS_FETCHED,
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
