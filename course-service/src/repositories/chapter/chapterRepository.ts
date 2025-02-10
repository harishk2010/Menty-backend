// import { updateRequestType } from "../Types/updateRequestType";
import { IChapter } from "../../models/chapterModel";
import { IChapterBaseRepository } from "../baseRepository/chapter/IChapterBaseRepository";
import { IChapterRepository } from "./IChapterRepository";

export class ChapterRepository implements IChapterRepository {
    private chapterBaseRepository:IChapterBaseRepository
    constructor(chapterBaseRepository:IChapterBaseRepository){
        this.chapterBaseRepository=chapterBaseRepository
    }
    async createChapter(chapterData: IChapter): Promise<IChapter> {
        return await this.chapterBaseRepository.createChapter(chapterData);
      }
    
    async  updateChapter(chapterId:string,chapterData: IChapter): Promise<IChapter | null> {
        return await this.chapterBaseRepository.updateChapterByChapterId(chapterId,chapterData);
      }
    
      // Get all chapters
      async getAllChapters(courseId:string): Promise<IChapter[]> {
        return await this.chapterBaseRepository.getAllChapters(courseId);
      }
    
      // Get a single chapter by ID
      async getChapterById(id: string): Promise<IChapter | null> {
        return await this.chapterBaseRepository.getChapterById(id);
      }
    }

