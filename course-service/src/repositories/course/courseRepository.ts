// import { updateRequestType } from "../Types/updateRequestType";
import { IPurchasedCourse } from "../../models/purchasedModel";
import { IChapter } from "../../models/chapterModel";
import { ICourse } from "../../models/courseModel";
import { ICourseBaseRepository } from "../baseRepository/ICourseBaseRepository";
import { CourseBaseRepository } from "../baseRepository/courseBaseRepository";
import { ICourseRepository } from "./ICourseRepository";

export class CourseRepository implements ICourseRepository {
    private courseBaseRepository:ICourseBaseRepository
    constructor(courseBaseRepository:ICourseBaseRepository){
        this.courseBaseRepository=courseBaseRepository
    }
    async createCourse(courseData: ICourse): Promise<ICourse> {
        return await this.courseBaseRepository.createCourse(courseData);
      }
    
    async  updateCourse(courseId:string,courseData: ICourse): Promise<ICourse | null> {
        return await this.courseBaseRepository.updateCourseByCourseId(courseId,courseData);
      }
    
      // Get all courses
      async getAllCourses(): Promise<ICourse[]> {
        return await this.courseBaseRepository.getAllCourses();
      }
    
      // Get a single course by ID
      async getCourseById(id: string): Promise<ICourse | null> {
        return await this.courseBaseRepository.getCourseById(id);
      }
      async getChapterById(id: string): Promise<IChapter[] | null> {
        return await this.courseBaseRepository.getChapterById(id);
      }
      async buyCourse(userId: string, courseId: string, completedChapters: any, txnid: string):Promise<IPurchasedCourse | null>{
         try {
          return await this.courseBaseRepository.buyCourse(userId,courseId,completedChapters,txnid)
          
         } catch (error) {
          console.log(error)
          throw error
         }
        }

        public async getBoughtCourses(userId: string, page: number, limit: number): Promise<any> {
          try {
              const response = await this.courseBaseRepository.getBoughtCourses(userId, page, limit)
              return response
          } catch (error: any) {
              throw error
          }
      }
    }

