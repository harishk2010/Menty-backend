import { IGenericRepository } from '../GenericRepository';
import { IReview } from '../../models/reviewModel';

export interface IReviewRepository extends IGenericRepository<IReview> {
  getReviewsByCourseId(courseId: string): Promise<IReview[]>;
  getUserReviewForCourse(userId: string, courseId: string): Promise<IReview | null>;
  getCourseAverageRating(courseId: string): Promise<number>;
}