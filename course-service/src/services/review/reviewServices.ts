import { IReviewService } from "../interfaces/IReviewService";
import { IReviewRepository } from "../../repositories/interfaces/IReviewRepository";
import { IReview } from "../../models/reviewModel";
import { CourseModel } from "../../models/courseModel";
import { Types } from "mongoose";
import { CourseErrorMessages, ReviewErrorMessages } from "@/utils/constants";

export class ReviewService implements IReviewService {
  private reviewRepository: IReviewRepository;
  constructor(reviewRepository: IReviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async createReview(
    userId: string,
    courseId: string,
    rating: number,
    comment?: string
  ): Promise<IReview> {
    try {
      const courseExists = await CourseModel.findById(courseId);
      if (!courseExists) {
        throw new Error(CourseErrorMessages.COURSE_NOT_FOUND);
      }

      const existingReview = await this.reviewRepository.getUserReviewForCourse(
        userId,
        courseId
      );
      if (existingReview) {
        throw new Error(ReviewErrorMessages.ALREADY_REVIEWED);
      }

      return await this.reviewRepository.create({
        courseId: new Types.ObjectId(courseId),
        userId: new Types.ObjectId(userId),
        rating,
        comment: comment || "",
      });
    } catch (error) {
      throw error;
    }
  }

  async getReviewsByCourse(courseId: string): Promise<IReview[]> {
    try {
      return await this.reviewRepository.getReviewsByCourseId(courseId);
    } catch (error) {
      throw error;
    }
  }

  async getAverageRating(courseId: string): Promise<number> {
    try {
      return await this.reviewRepository.getCourseAverageRating(courseId);
    } catch (error) {
      throw error;
    }
  }
}
