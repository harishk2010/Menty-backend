import { IChapter } from "../../models/chapterModel";
import { IGenericRepository } from "../GenericRepository";

export interface IChapterRepository extends IGenericRepository<IChapter> {
  getAllChapters(courseId: string): Promise<IChapter[]>;
}
