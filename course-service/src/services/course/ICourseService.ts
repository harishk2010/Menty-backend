import { ICourse } from '../../models/courseModel'
import { updateRequestType } from '../../Types/updateRequestType'


export interface ICourseService{
    createCourse(courseData: ICourse): Promise<ICourse>
    updateCourse(courseId:string,courseData: ICourse): Promise<ICourse | null>
    getAllCourses(): Promise<ICourse[]>
    getCourseById(id: string): Promise<ICourse | null>
}