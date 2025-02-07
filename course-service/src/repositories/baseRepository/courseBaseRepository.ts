import { updateRequestType } from "@/Types/updateRequestType";
import { ICourseBaseRepository } from "./ICourseBaseRepository";
import { CourseModel, ICourse } from "../../models/courseModel";

export class CourseBaseRepository implements ICourseBaseRepository{

    async createCourse(courseData: ICourse): Promise<ICourse> {
        const course = new CourseModel(courseData);
        return await course.save();
      }
    
      // Get all courses
      async getAllCourses(): Promise<ICourse[]> {
        return await CourseModel.find();
      }
    
      // Get a single course by ID
      async getCourseById(id: string): Promise<ICourse | null> {
        return await CourseModel.findById(id);
      }
    }


   
