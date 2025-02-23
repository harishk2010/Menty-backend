import { ICourse } from "../../models/courseModel";
import { IChapter } from "../../models/chapterModel";
import { IPurchasedCourse } from "../../models/purchasedModel";

export interface ICourseService {
  createCourse(courseData: ICourse): Promise<ICourse>;
  updateCourse(courseId: string, courseData: ICourse): Promise<ICourse | null>;
  getBoughtCourseById(courseId: string): Promise<IPurchasedCourse | null>;
  getAllCourses(): Promise<ICourse[]>;
  getInstructorCourses(instructorId: string): Promise<ICourse[]>;
  getCourseById(id: string): Promise<ICourse | null>;
  getChaptersById(id: string): Promise<IChapter[] | null>;
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