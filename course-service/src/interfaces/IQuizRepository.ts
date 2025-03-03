import { IQuiz } from "../models/quizModel";
import { IGenericRepository } from "../repositories/GenericRepository";

export interface IQuizRepository extends IGenericRepository<IQuiz> {}