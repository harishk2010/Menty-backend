import { IChapter } from "../../models/chapterModel";
import { GenericRepository } from "../GenericRepository";
import {ChapterModel} from "../../models/chapterModel";
import { IChapterRepository } from "../../interfaces/IChapterRepository";

export class ChapterRepository extends GenericRepository<IChapter> implements IChapterRepository {
  constructor() {
    super(ChapterModel);
  }

  async getAllChapters(courseId: string): Promise<IChapter[]> {
    try {
      const chapters = await this.findAll({ courseId });
      return chapters;
    } catch (error) {
      throw error;
    }
  }
}