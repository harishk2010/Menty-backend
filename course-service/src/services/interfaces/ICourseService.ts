import { ICourse } from "../../models/courseModel";
import { IChapter } from "../../models/chapterModel";
import { IPurchasedCourse } from "../../models/purchasedModel";
import { CoursesResult, Paginatedcourses } from "../../Types/updateRequestType";
import { IUser } from "../../models/userModel";

export interface ICourseService {
  createCourse(courseData: ICourse): Promise<ICourse>;
  updateCourse(courseId: string, courseData: ICourse): Promise<ICourse | null>;
  getBoughtCourseById(courseId: string): Promise<IPurchasedCourse | null>;
  getAllCourses(): Promise<ICourse[]>;
  getPaginatedCourses(
    page: number,
    limit: number,
    search: string,
    sort: string,
    category: string[],
    level: string[]
  ): Promise<Paginatedcourses>;
  getInstructorCourses(instructorId: string): Promise<ICourse[]>;
  getInstructorCoursesList(
    instructorId: string,
    page: number,
    limit: number,
    search: string,
    sortField: string,
    sortOrder: "asc" | "desc"
  ): Promise<CoursesResult | null>;
  getCourseById(id: string): Promise<ICourse | null>;
  getChaptersById(id: string): Promise<IChapter[] | null>;
  buyCourse(
    userId: string,
    quizId: string,
    courseId: string,
    completedChapters: any,
    txnid: string,
    price: Number
  ): Promise<IPurchasedCourse | null>;
  getBoughtCourses(userId: string, page: number, limit: number): Promise<any>;
  chapterVideoEnd(chapterId: string): Promise<any>;
  deleteCourseById(courseId: string): Promise<any>;
  createStudent(payload: IUser): Promise<any>;
}
