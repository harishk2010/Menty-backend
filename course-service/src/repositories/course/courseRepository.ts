// import { updateRequestType } from "../Types/updateRequestType";
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
    }

