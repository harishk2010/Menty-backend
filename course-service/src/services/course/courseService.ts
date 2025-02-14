import { IChapter } from "../../models/chapterModel";
import { ICourse } from "../../models/courseModel";
import { ICourseRepository } from "../../repositories/course/ICourseRepository";
import { ICourseService } from "./ICourseService";
import { IPurchasedCourse } from "../../models/purchasedModel";

export class CourseService implements ICourseService {
  private courseRepository: ICourseRepository;
  constructor(courseRepository: ICourseRepository) {
    this.courseRepository = courseRepository;
  }

  async createCourse(courseData: ICourse): Promise<ICourse> {
    return await this.courseRepository.createCourse(courseData);
  }

  async updateCourse(
    courseId: string,
    courseData: ICourse
  ): Promise<ICourse | null> {
    return await this.courseRepository.updateCourse(courseId, courseData);
  }

  // Get all courses
  async getAllCourses(): Promise<ICourse[]> {
    return await this.courseRepository.getAllCourses();
  }

  // Get a single course by ID
  async getCourseById(id: string): Promise<ICourse | null> {
    return await this.courseRepository.getCourseById(id);
  }
  async getChaptersById(id: string): Promise<IChapter[] | null> {
    return await this.courseRepository.getChapterById(id);
  }
  async buyCourse(
    userId: string,
    courseId: string,
    completedChapters: any,
    txnid: string
  ): Promise<IPurchasedCourse | null> {
    try {
      return await this.courseRepository.buyCourse(
        userId,
        courseId,
        completedChapters,
        txnid
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getBoughtCourses(
    userId: string,
    page: number,
    limit: number
  ): Promise<any> {
    try {
      const response = await this.courseRepository.getBoughtCourses(
        userId,
        page,
        limit
      );
      return response;
    } catch (error: any) {
      throw error;
    }
  }
  public async chapterVideoEnd(courseId: string): Promise<ICourse | null> {
    try {
      const response = await this.courseRepository.chapterVideoEnd(
        courseId
      );
      return response;
    } catch (error: any) {
      throw error;
    }
  }
}
