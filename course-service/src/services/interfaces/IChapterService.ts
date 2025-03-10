import { IChapter, CreateChapterDTO } from "../../models/chapterModel";

export interface IChapterService {
  createChapter(chapterData: CreateChapterDTO): Promise<IChapter>;
  updateChapter(
    chapterId: string,
    chapterData: Partial<IChapter>
  ): Promise<IChapter | null>;
  getAllChapters(courseId: string): Promise<IChapter[]>;
  getChapterById(id: string): Promise<IChapter | null>;
}
