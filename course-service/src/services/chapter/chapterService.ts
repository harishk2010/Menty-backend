import { IChapter } from '../../models/chapterModel';
import { IChapterRepository } from '../../repositories/chapter/IChapterRepository'
import {IChapterService} from './IChapterService'

export class ChapterService implements IChapterService{
    
    private chapterRepository:IChapterRepository
    constructor(chapterRepository:IChapterRepository){
        this.chapterRepository=chapterRepository
    }

    async createChapter(chapterData: IChapter): Promise<IChapter> {
        return await this.chapterRepository.createChapter(chapterData);
      }
    
    async updateChapter(chapterId:string,chapterData: IChapter): Promise<IChapter | null> {
        return await this.chapterRepository.updateChapter(chapterId,chapterData);
      }
    
     
      async getAllChapters(courseId:string): Promise<IChapter[]> {
        return await this.chapterRepository.getAllChapters(courseId);
      }
    
      
      async getChapterById(id: string): Promise<IChapter | null> {
        return await this.chapterRepository.getChapterById(id);
      }
    }

