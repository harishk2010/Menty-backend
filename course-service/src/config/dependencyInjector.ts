import { ICourseService } from "../services/course/ICourseService"
import { ICourseControllers } from "../controllers/course/ICourseControllers"
import { CourseContoller } from "../controllers/course/courseControllers"
import { CourseService } from "../services/course/courseService"
import { ICourseRepository } from "../repositories/course/ICourseRepository"
import { CourseRepository } from "../repositories/course/courseRepository"
import { ICourseBaseRepository } from "../repositories/baseRepository/ICourseBaseRepository"
import { CourseBaseRepository } from "../repositories/baseRepository/courseBaseRepository"
import { IChapterControllers } from "../controllers/chapter/IChapterControllers"
import { ChapterContoller } from "../controllers/chapter/chapterControllers"
import { IChapterService } from "../services/chapter/IChapterService"
import { ChapterService } from "../services/chapter/chapterService"
import { IChapterRepository } from "../repositories/chapter/IChapterRepository"
import { ChapterRepository } from "../repositories/chapter/chapterRepository"
import { IChapterBaseRepository } from "../repositories/baseRepository/chapter/IChapterBaseRepository"
import { ChapterBaseRepository } from "../repositories/baseRepository/chapter/chapterBaseRepository"

const courseBaseRepository:ICourseBaseRepository=new CourseBaseRepository()
const courseRepository:ICourseRepository=new CourseRepository(courseBaseRepository)
const courseService:ICourseService=new CourseService(courseRepository)
const  courseController:ICourseControllers=new CourseContoller(courseService)


const chapterBaseRepository:IChapterBaseRepository=new ChapterBaseRepository()
const chapterRepository:IChapterRepository=new ChapterRepository(chapterBaseRepository)
const chapterService:IChapterService=new ChapterService(chapterRepository)
const chapterController:IChapterControllers=new ChapterContoller(chapterService)

export { courseController,chapterController}