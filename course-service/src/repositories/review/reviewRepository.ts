import { GenericRepository } from "../GenericRepository";
import { ReviewModel, IReview } from "../../models/reviewModel";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import mongoose from "mongoose";

export class ReviewRepository
  extends GenericRepository<IReview>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }

  async getReviewsByCourseId(courseId: string): Promise<IReview[]> {
    try {
      const response = await ReviewModel.find({ courseId })

        .populate("userId", "username email profilePicUrl")

        .sort({ createdAt: -1 });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getUserReviewForCourse(
    userId: string,
    courseId: string
  ): Promise<IReview | null> {
    try {
      return await ReviewModel.findOne({ userId, courseId });
    } catch (error) {
      throw error;
    }
  }

  async getCourseAverageRating(courseId: string): Promise<number> {
    try {
      const result = await ReviewModel.aggregate([
        {
          $match: {
            courseId: new mongoose.Types.ObjectId(courseId),
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
