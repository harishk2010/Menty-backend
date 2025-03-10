import { IMentorReview } from "../../models/mentorReviewModel";

export interface IMentorReviewService {
  createReview(
    userId: string,
    mentorId: string,
    rating: number,
    comment?: string
  ): Promise<IMentorReview>;

  getReviewsByMentor(mentorId: string): Promise<IMentorReview[]>;
  getAverageRating(mentorId: string): Promise<number>;
}
