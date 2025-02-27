import { ICourse } from "../../models/courseModel";
import { ICourseService } from "./ICourseService";
import { CourseRepository } from "../../repositories/course/courseRepository";
import { IChapter } from "../../models/chapterModel";
import { IPurchasedCourse } from "../../models/purchasedModel";
import { ICourseRepository } from "../../repositories/course/ICourseRepository";
import { CoursesResult } from "../../Types/updateRequestType";

export class CourseService implements ICourseService {
  private courseRepository: ICourseRepository;

  constructor(courseRepository: ICourseRepository) {
    this.courseRepository = courseRepository;
  }

  async createCourse(courseData: ICourse): Promise<ICourse> {
    return await this.courseRepository.create(courseData);
  }

  async updateCourse(courseId: string, courseData: ICourse): Promise<ICourse | null> {
    return await this.courseRepository.update(courseId, courseData);
  }

  async getAllCourses(): Promise<ICourse[]> {
    return await this.courseRepository.findAll();
  }

  async getInstructorCourses(instructorId: string): Promise<ICourse[]> {
    return await this.courseRepository.getInstructorCourses(instructorId);
  }

  async getCourseById(id: string): Promise<ICourse | null> {
    return await this.courseRepository.findById(id);
  }

  async getChaptersById(id: string): Promise<IChapter[] | null> {
    return await this.courseRepository.getChapterById(id);
  }
  async getInstructorCoursesList(
    instructorId: string, 
    page: number, 
    limit: number,
    search: string = '',
    sortField: string = 'lastUpdated',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<CoursesResult | null> {
    try {
      const result = await this.courseRepository.getInstructorCoursesList(
        instructorId, 
        page, 
        limit,
        search,
        sortField,
        sortOrder
      );
      
      return result;
    } catch (error) {
      console.error("Error in getInstructorCoursesList service:", error);
      throw error;
    }
  }
  async getPaginatedCourses(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    sort: string = "popular",
    category: string[] = [],
    level: string[] = []
  ): Promise<{ courses: ICourse[]; currentPage: number; totalPages: number; totalCourses: number }> {
    return await this.courseRepository.getPaginatedCourses(page, limit, search, sort, category, level);
  }

  async buyCourse(
    userId: string,
    quizId: string,
    courseId: string,
    completedChapters: any,
    txnid: string
  ): Promise<IPurchasedCourse | null> {
    return await this.courseRepository.buyCourse(userId, quizId, courseId, completedChapters, txnid);
  }

  async getBoughtCourses(userId: string, page: number, limit: number): Promise<any> {
    return await this.courseRepository.getBoughtCourses(userId, page, limit);
  }

  async chapterVideoEnd(chapterId: string): Promise<any> {
    return await this.courseRepository.chapterVideoEnd(chapterId);
  }
  async deleteCourseById(courseId: string): Promise<any> {
    return await this.courseRepository.deleteCourseById(courseId)
  }
  async getBoughtCourseById(courseId: string): Promise<IPurchasedCourse | null> {
    try {
      return await this.courseRepository.getBoughtCourseById(courseId);
      
    } catch (error) {
      throw error
      
    }
    
  }
}