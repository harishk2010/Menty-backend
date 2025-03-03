import { IQuiz } from "../../models/quizModel";
import { IQuizService } from "../../interfaces/IQuizService";
import { QuizRepository } from "../../repositories/quiz/QuizRepository";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchasedModel";
import { IQuizRepository } from "../../interfaces/IQuizRepository";

export class QuizService implements IQuizService {
  private quizRepository: IQuizRepository;

  constructor(quizRepository: IQuizRepository) {
    this.quizRepository = quizRepository;
  }

  async addQuiz(quizData: IQuiz): Promise<IQuiz> {
    return await this.quizRepository.create(quizData);
  }

  async editQuiz(id: string, quizData: Partial<IQuiz>): Promise<IQuiz | null> {
    return await this.quizRepository.update(id, quizData);
  }

  async getQuiz(id: string): Promise<IQuiz | null> {
    return await this.quizRepository.findById(id);
  }

  async markCourseAsCompleted(userId: string, courseId: string): Promise<void> {
    await PurchasedCourseModel.findOneAndUpdate(
      { userId, courseId },
      { isCourseCompleted: true },
      { new: true }
    );
  }
}