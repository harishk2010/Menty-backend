import { Request, Response, NextFunction } from "express";
import { IQuizService } from "../../services/interfaces/IQuizService";
import getId from "../../utils/getId";
import { CourseModel } from "../../models/courseModel";
import { QuizErrorMessages, QuizSuccessMessages } from "@/utils/constants";
import { StatusCode } from "@/utils/enums";

export class QuizController {
  private quizService: IQuizService;

  constructor(quizService: IQuizService) {
    this.quizService = quizService;
  }

  async addQuiz(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const quizData = req.body;
      const savedQuiz = await this.quizService.addQuiz(quizData);
      const courseData = await CourseModel.findById(quizData.courseId);

      if (!courseData) throw new Error(QuizErrorMessages.NO_COURSE_FOUND);

      const updatedCourseData = {
        ...courseData.toObject(),
        quizId: savedQuiz._id,
      };

      await CourseModel.findOneAndUpdate(savedQuiz.courseId, updatedCourseData);

      res
        .status(StatusCode.CREATED)
        .json({
          success: true,
          message: QuizSuccessMessages.QUIZ_ADDED,
          data: savedQuiz,
        });
    } catch (error) {
      next(error);
    }
  }

  async editQuiz(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quizId } = req.params;
      const quizData = req.body;
      const updatedQuiz = await this.quizService.editQuiz(quizId, quizData);
      res
        .status(StatusCode.OK)
        .json({
          success: true,
          message: QuizSuccessMessages.QUIZ_UPDATED,
          data: updatedQuiz,
        });
    } catch (error) {
      next(error);
    }
  }

  async getQuiz(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quizId } = req.params;
      const quiz = await this.quizService.getQuiz(quizId);
      res
        .status(StatusCode.OK)
        .json({
          success: true,
          message: QuizSuccessMessages.QUIZ_FETCHED,
          data: quiz,
        });
    } catch (error) {
      next(error);
    }
  }

  async submitResult(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const { score, total } = req.body;
      const userId = await getId("accessToken", req);
      if (!userId) {
        throw new Error(QuizErrorMessages.INTERNAL_SERVER_ERROR);
      }

      const percentage = (score / total) * 100;
      const isPass = percentage > 40;

      if (isPass) {
        await this.quizService.markCourseAsCompleted(userId, courseId);
        res
          .status(StatusCode.OK)
          .json({ success: true, message: QuizSuccessMessages.COURSE_COMPLETED });
      } else {
        res.status(200).json({ success: false, message: QuizSuccessMessages.RETRY_QUIZ });
      }
    } catch (error) {
      next(error);
    }
  }
}
