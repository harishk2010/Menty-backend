import { IGenericRepository } from "../GenericRepository";
import { IMentorReview } from "../../models/mentorReviewModel";

export interface IMentorReviewRepository
  extends IGenericRepository<IMentorReview> {
  getReviewsByMentorId(mentorId: string): Promise<IMentorReview[]>;
  getUserReviewForMentor(
    userId: string,
    mentorId: string
  ): Promise<IMentorReview | null>;
  getMentorAverageRating(mentorId: string): Promise<number>;
}
