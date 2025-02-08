import { ICourse } from "../../models/courseModel";
import { updateRequestType } from "../../Types/updateRequestType";
// import { ICourseModel } from "../../models/courseModel";

export interface ICourseBaseRepository{
    createCourse(courseData: ICourse): Promise<ICourse>
    updateCourseByCourseId(courseId:string,courseData: ICourse): Promise<ICourse | null>
    getAllCourses(): Promise<ICourse[]>
    getCourseById(id: string): Promise<ICourse | null>
}
   
