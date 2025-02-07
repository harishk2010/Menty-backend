import { ICourse } from "../../models/courseModel";
import { updateRequestType } from "../../Types/updateRequestType";
// import { ICourseModel } from "../../models/courseModel";

export interface ICourseBaseRepository{
    createCourse(courseData: ICourse): Promise<ICourse>
    getAllCourses(): Promise<ICourse[]>
    getCourseById(id: string): Promise<ICourse | null>
}
   
