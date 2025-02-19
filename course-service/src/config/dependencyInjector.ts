import { ICourseService } from "../services/course/ICourseService"
import { ICourseControllers } from "../controllers/course/ICourseControllers"
import { CourseContoller } from "../controllers/course/courseControllers"
import { CourseService } from "../services/course/courseService"
import { ICourseRepository } from "../repositories/course/ICourseRepository"
import { CourseRepository } from "../repositories/course/courseRepository"
import { ICourseBaseRepository } from "../repositories/baseRepository/ICourseBaseRepository"
import { CourseBaseRepository } from "../repositories/baseRepository/courseBaseRepository"
import { IChapterControllers } from "../controllers/chapter/IChapterControllers"
import { ChapterController } from "../controllers/chapter/chapterControllers"
import { IChapterService } from "../services/chapter/IChapterService"
import { ChapterService } from "../services/chapter/chapterService"
import { IChapterRepository } from "../repositories/chapter/IChapterRepository"
import { ChapterRepository } from "../repositories/chapter/chapterRepository"
import { IChapterBaseRepository } from "../repositories/baseRepository/chapter/IChapterBaseRepository"
import { ChapterBaseRepository } from "../repositories/baseRepository/chapter/chapterBaseRepository"
import { IQuizRepository } from "../repositories/quiz/IQuizRepository"
import { QuizRepository } from "../repositories/quiz/QuizRepository"
import { IQuizService } from "../services/quiz/IQuizService"
import { QuizService } from "../services/quiz/QuizService"
import { IQuizController } from "../controllers/quiz/IQuizController"
import { QuizController } from "../controllers/quiz/QuizController"

// const courseBaseRepository:ICourseBaseRepository=new CourseBaseRepository()
const courseRepository:ICourseRepository=new CourseRepository()
const courseService:ICourseService=new CourseService(courseRepository)
const  courseController:ICourseControllers=new CourseContoller(courseService)


// const chapterBaseRepository:IChapterBaseRepository=new ChapterBaseRepository()
const chapterRepository:IChapterRepository=new ChapterRepository()
const chapterService:IChapterService=new ChapterService(chapterRepository)
const chapterController:IChapterControllers=new ChapterController(chapterService)

const quizRepository:IQuizRepository=new QuizRepository()
const quizService:IQuizService=new QuizService(quizRepository)
const quizController:IQuizController=new QuizController(quizService)

export { courseController,chapterController ,quizController}