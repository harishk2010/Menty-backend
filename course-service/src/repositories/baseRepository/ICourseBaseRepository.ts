import { IPurchasedCourse } from "../../models/purchasedModel";
import { IChapter } from "../../models/chapterModel";
import { ICourse } from "../../models/courseModel";
import { updateRequestType } from "../../Types/updateRequestType";
// import { ICourseModel } from "../../models/courseModel";

export interface ICourseBaseRepository{
    createCourse(courseData: ICourse): Promise<ICourse>
    updateCourseByCourseId(courseId:string,courseData: ICourse): Promise<ICourse | null>
    getAllCourses(): Promise<ICourse[]>
    getCourseById(id: string): Promise<ICourse | null>
    getChapterById(id: string): Promise<IChapter[] | null>
     buyCourse(userId: string, courseId: string, completedChapters: any, txnid: string):Promise<IPurchasedCourse | null>
     getBoughtCourses(userId: string, page: number , limit: number ): Promise<any>
     chapterVideoEnd(courseId: string): Promise<ICourse | null>
    }
   
