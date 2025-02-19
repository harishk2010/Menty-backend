import { Request, Response, NextFunction } from "express";
import { IQuizService } from "../../services/quiz/IQuizService";
import getId from "../../utils/getId";
import { CourseService } from "@/services/course/courseService";
import { CourseContoller } from "../course/courseControllers";
import { CourseModel } from "../../models/courseModel";

export  class QuizController {
  private quizService: IQuizService;
//   private courseService:CourseService

  constructor(quizService: IQuizService) {
    this.quizService = quizService;
    // this.courseService=new CourseService()
  }

  async addQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quizData = req.body;
      console.log("quizdata",quizData)
      const savedQuiz = await this.quizService.addQuiz(quizData);
    //   const courseService=new CourseContoller()
            const courseData = await CourseModel.findById(quizData.courseId);

      if (!courseData) throw new Error("No course found");

          const updatedCourseData = { ...courseData.toObject(), quizId:savedQuiz._id};
          
         
    
            await CourseModel.findOneAndUpdate(savedQuiz.courseId,updatedCourseData)
          
      console.log(savedQuiz,"saved")
      res.status(201).json({ success: true, message: "Quiz added successfully", data: savedQuiz });
    } catch (error) {
      next(error);
    }
  }

  async editQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quizId } = req.params;
      const quizData = req.body;
      const updatedQuiz = await this.quizService.editQuiz(quizId, quizData);
      res.status(200).json({ success: true, message: "Quiz updated successfully", data: updatedQuiz });
    } catch (error) {
      next(error);
    }
  }

  async getQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quizId } = req.params;
      console.log(quizId)
      const quiz = await this.quizService.getQuiz(quizId);
      res.status(200).json({ success: true, message: "Quiz fetched successfully", data: quiz });
    } catch (error) {
      next(error);
    }
  }

  async submitResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const { score, total } = req.body;
      const userId = await getId("accessToken", req);
      if(!userId){
        throw new Error("No user found")
      }

      const percentage = (score / total) * 100;
      const isPass = percentage > 40;

      if (isPass) {
        await this.quizService.markCourseAsCompleted(userId, courseId);
        res.status(200).json({ success: true, message: "Course completed successfully!" });
      } else {
        res.status(200).json({ success: false, message: "Retry quiz!" });
      }
    } catch (error) {
      next(error);
    }
  }
}