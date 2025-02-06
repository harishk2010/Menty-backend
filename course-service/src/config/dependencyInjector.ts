import { ICourseService } from "../services/course/ICourseService"
import { ICourseControllers } from "../controllers/course/ICourseControllers"
import { CourseContoller } from "../controllers/course/courseControllers"
import { CourseService } from "../services/course/courseService"
import { ICourseRepository } from "../repositories/course/ICourseRepository"
import { CourseRepository } from "../repositories/course/courseRepository"
import { ICourseBaseRepository } from "../repositories/baseRepository/ICourseBaseRepository"
import { CourseBaseRepository } from "../repositories/baseRepository/courseBaseRepository"

const courseBaseRepository:ICourseBaseRepository=new CourseBaseRepository()
const courseRepository:ICourseRepository=new CourseRepository(courseBaseRepository)
const courseService:ICourseService=new CourseService(courseRepository)
const  courseController:ICourseControllers=new CourseContoller(courseService)



export { courseController}