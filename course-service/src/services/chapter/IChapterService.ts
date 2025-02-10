import { CreateChapterDTO, IChapter } from '../../models/chapterModel'
import { updateRequestType } from '../../Types/updateRequestType'


export interface IChapterService{
    createChapter(chapterData: CreateChapterDTO): Promise<IChapter>
    updateChapter(chapterId:string,chapterData: CreateChapterDTO): Promise<IChapter | null>
    getAllChapters(courseId:string): Promise<IChapter[]>
    getChapterById(id: string): Promise<IChapter | null>
}