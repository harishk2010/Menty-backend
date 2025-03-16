import { IMentorReviewService } from "../interfaces/IMentorReviewService";
import { IMentorReviewRepository } from "../../repostories/interfaces/IMentorReviewRepository";
import { IMentorReview } from "../../models/mentorReviewModel";
import InstructorModel from "../../models/instructorModel";
import { Types } from "mongoose";
import { MentorReviewErrorMessages } from "../../utils/constants";

export class MentorReviewService implements IMentorReviewService {
  private mentorReviewRepository: IMentorReviewRepository;

  constructor(mentorReviewRepository: IMentorReviewRepository) {
    this.mentorReviewRepository = mentorReviewRepository;
  }

  async createReview(
    userId: string,
    mentorId: string,
    rating: number,
    comment?: string
  ): Promise<IMentorReview> {
    try {
      const mentorExists = await InstructorModel.findById(mentorId);
      if (!mentorExists) {
        throw new Error(MentorReviewErrorMessages.MENTOR_NOT_FOUND);
      }

      const existingReview =
        await this.mentorReviewRepository.getUserReviewForMentor(
          userId,
          mentorId
        );
      if (existingReview) {
        throw new Error(MentorReviewErrorMessages.MENTOR_ALREADY_REVIEWED);
      }

      const response = await this.mentorReviewRepository.create({
        mentorId: new Types.ObjectId(mentorId),
        userId: new Types.ObjectId(userId),
        rating,
        comment: comment || "",
        date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
      });
      const avgRating =
        await this.mentorReviewRepository.getMentorAverageRating(mentorId);

      await InstructorModel.findByIdAndUpdate(mentorId, {
        $set: {
          rating: avgRating,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getReviewsByMentor(mentorId: string): Promise<IMentorReview[]> {
    try {
      return await this.mentorReviewRepository.getReviewsByMentorId(mentorId);
    } catch (error) {
      throw error;
    }
  }

  async getAverageRating(mentorId: string): Promise<number> {
    try {
      return await this.mentorReviewRepository.getMentorAverageRating(mentorId);
    } catch (error) {
      throw error;
    }
  }
}
