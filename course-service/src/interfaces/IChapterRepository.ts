import { IChapter } from "../models/chapterModel";
import { IGenericRepository } from "../repositories/GenericRepository";

export interface IChapterRepository extends IGenericRepository<IChapter> {
  getAllChapters(courseId: string): Promise<IChapter[] >;
}