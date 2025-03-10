import { GenericRepository } from "../GenericRepository";
import {
  MentorReviewModel,
  IMentorReview,
} from "../../models/mentorReviewModel";
import { IMentorReviewRepository } from "../interfaces/IMentorReviewRepository";
import mongoose from "mongoose";

export class MentorReviewRepository
  extends GenericRepository<IMentorReview>
  implements IMentorReviewRepository
{
  constructor() {
    super(MentorReviewModel);
  }

  async getReviewsByMentorId(mentorId: string): Promise<IMentorReview[]> {
    try {
      const response = await MentorReviewModel.find({ mentorId })
        .populate("userId", "username email profilePicUrl")
        .sort({ createdAt: -1 });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getUserReviewForMentor(
    userId: string,
    mentorId: string
  ): Promise<IMentorReview | null> {
    try {
      return await MentorReviewModel.findOne({ userId, mentorId });
    } catch (error) {
      throw error;
    }
  }

  async getMentorAverageRating(mentorId: string): Promise<number> {
    try {
      const result = await MentorReviewModel.aggregate([
        {
          $match: {
            mentorId: new mongoose.Types.ObjectId(mentorId),
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return result[0]?.averageRating || 0;
    } catch (error) {
      throw error;
    }
  }
}
