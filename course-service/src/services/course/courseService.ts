import { ICourse } from '../../models/courseModel';
import { ICourseRepository } from '../../repositories/course/ICourseRepository'
import {ICourseService} from './ICourseService'

export class CourseService implements ICourseService{
    
    private courseRepository:ICourseRepository
    constructor(courseRepository:ICourseRepository){
        this.courseRepository=courseRepository
    }

    async createCourse(courseData: ICourse): Promise<ICourse> {
        return await this.courseRepository.createCourse(courseData);
      }
    
    async updateCourse(courseId:string,courseData: ICourse): Promise<ICourse | null> {
        return await this.courseRepository.updateCourse(courseId,courseData);
      }
    
      // Get all courses
      async getAllCourses(): Promise<ICourse[]> {
        return await this.courseRepository.getAllCourses();
      }
    
      // Get a single course by ID
      async getCourseById(id: string): Promise<ICourse | null> {
        return await this.courseRepository.getCourseById(id);
      }
    }

