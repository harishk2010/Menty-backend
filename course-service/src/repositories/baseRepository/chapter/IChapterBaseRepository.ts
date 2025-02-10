import { IChapter } from "../../../models/chapterModel";
import { updateRequestType } from "../../../Types/updateRequestType";
// import { IChapterModel } from "../../models/chapterModel";

export interface IChapterBaseRepository{
    createChapter(chapterData: IChapter): Promise<IChapter>
    updateChapterByChapterId(chapterId:string,chapterData: IChapter): Promise<IChapter | null>
    getAllChapters(courseId:string): Promise<IChapter[]>
    getChapterById(id: string): Promise<IChapter | null>
}
   
