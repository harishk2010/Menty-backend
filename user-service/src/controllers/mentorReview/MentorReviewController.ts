import { NextFunction, Request, Response } from "express";
import { IMentorReviewService } from "../../services/interfaces/IMentorReviewService";
import getId from "../../utils/getId";
import { IMentorReviewController } from "../interfaces/IMentorReviewController";

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
        res.status(201).json({
          success: true,
          message: "Review created successfully",
          data: newReview,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Something Went Wrong",
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

      res.status(200).json({
        success: true,
        message: "Mentor reviews retrieved successfully",
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
