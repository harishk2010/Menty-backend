import { IReview } from "../../models/reviewModel";

export interface IReviewService {
  createReview(
    userId: string,
    courseId: string,
    rating: number,
    comment?: string
  ): Promise<IReview>;

  getReviewsByCourse(courseId: string): Promise<IReview[]>;
  getAverageRating(courseId: string): Promise<number>;
}
