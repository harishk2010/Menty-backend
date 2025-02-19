import { ICourse } from "../../models/courseModel";
import { IGenericRepository } from "../GenericRepository";
import { IChapter } from "../../models/chapterModel";
import { IPurchasedCourse } from "../../models/purchasedModel";

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
  getBoughtCourses(userId: string, page: number, limit: number): Promise<any>;
  chapterVideoEnd(chapterId: string): Promise<any>;
}