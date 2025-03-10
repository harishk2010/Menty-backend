import { CreateChapterDTO, IChapter } from "../../models/chapterModel";
import { IChapterService } from "../interfaces/IChapterService";
import { IChapterRepository } from "../../repositories/interfaces/IChapterRepository";

export class ChapterService implements IChapterService {
  private chapterRepository: IChapterRepository;

  constructor(chapterRepository: IChapterRepository) {
    this.chapterRepository = chapterRepository;
  }

  async createChapter(chapterData: IChapter): Promise<IChapter> {
    return await this.chapterRepository.create(chapterData);
  }

  async updateChapter(
    chapterId: string,
    chapterData: Partial<IChapter>
  ): Promise<IChapter | null> {
    return await this.chapterRepository.update(chapterId, chapterData);
  }

  async getAllChapters(courseId: string): Promise<IChapter[]> {
    return await this.chapterRepository.getAllChapters(courseId);
  }

  async getChapterById(id: string): Promise<IChapter | null> {
    return await this.chapterRepository.findById(id);
  }
}
