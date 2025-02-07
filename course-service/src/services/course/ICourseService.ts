import { ICourse } from '../../models/courseModel'
import { updateRequestType } from '../../Types/updateRequestType'


export interface ICourseService{
    createCourse(courseData: ICourse): Promise<ICourse>
    getAllCourses(): Promise<ICourse[]>
    getCourseById(id: string): Promise<ICourse | null>
}