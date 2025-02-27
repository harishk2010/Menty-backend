import { ICourse } from "../../models/courseModel";
import { IGenericRepository } from "../GenericRepository";
import { IChapter } from "../../models/chapterModel";
import { IPurchasedCourse } from "../../models/purchasedModel";
import { CoursesResult, Paginatedcourses } from "../../Types/updateRequestType";

export interface ICourseRepository extends IGenericRepository<ICourse> {
  getChapterById(id: string): Promise<IChapter[] | null>;
  getInstructorCourses(instructorId: string): Promise<ICourse[]>;
  buyCourse(
    userId: string,
    quizId: string,
    courseId: string,
    completedChapters: any,
    txnid: string
  ): Promise<IPurchasedCourse | null>;
  getPaginatedCourses( page: number ,
      limit: number ,
      search: string ,
      sort: string,
      category: string[] ,
      level: string[] ):Promise<Paginatedcourses>
        getInstructorCoursesList(instructorId:string,page:number,limit:number,search:string,sortField:string,sortOrder:"asc" | "desc"): Promise<CoursesResult | null>
      
  getBoughtCourses(userId: string, page: number, limit: number): Promise<any>;
  chapterVideoEnd(chapterId: string): Promise<any>;
  getBoughtCourseById(courseId: string): Promise<IPurchasedCourse | null>
  deleteCourseById(courseId: string): Promise<ICourse | null>
}