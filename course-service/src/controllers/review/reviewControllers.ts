import { NextFunction, Request, Response } from 'express';
import { IReviewService } from '../../services/interfaces/IReviewService';
import  getId  from '../../utils/getId';
import { IReviewController } from '../interfaces/IReviewControllers';

export class ReviewController implements IReviewController {
    private reviewService: IReviewService
  constructor( reviewService: IReviewService) {
    this.reviewService=reviewService
  }

  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId, rating, comment } = req.body;
      console.log(req.body,"review")
      const userId = await getId("accessToken", req);

      const newReview = await this.reviewService.createReview(
        String(userId), 
        courseId, 
        rating, 
        comment
      );
      if(newReview){

          res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: newReview
          });
      }else{
        res.status(500).json({
            success: false,
            message: 'Something Went Wrong',
        
          });
      }

    } catch (error) {
      next(error);
    }
  }

  async getCourseReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      console.log(courseId,"gettt")

      const reviews = await this.reviewService.getReviewsByCourse(courseId);
      const averageRating = await this.reviewService.getAverageRating(courseId);
      console.log(reviews,averageRating,"avggggg")
      

      res.status(200).json({
        success: true,
        message: 'Course reviews retrieved successfully',
        data: {
          reviews,
          averageRating
        }
      });
    } catch (error) {
      next(error);
    }
  }
}