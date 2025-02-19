import { IQuiz } from "../../models/quizModel";
import { GenericRepository } from "../GenericRepository";
import {QuizModel} from "../../models/quizModel";
import { IQuizRepository } from "./IQuizRepository";

export class QuizRepository extends GenericRepository<IQuiz> implements IQuizRepository {
  constructor() {
    super(QuizModel);
  }
}