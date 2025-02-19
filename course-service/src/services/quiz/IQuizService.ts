import { IQuiz } from "../../models/quizModel";

export interface IQuizService {
  addQuiz(quizData: IQuiz): Promise<IQuiz>;
  editQuiz(id: string, quizData: Partial<IQuiz>): Promise<IQuiz | null>;
  getQuiz(id: string): Promise<IQuiz | null>;
  markCourseAsCompleted(userId: string, courseId: string): Promise<void>;
}