import { ICourseService } from "../interfaces/ICourseService"
import { ICourseControllers } from "../interfaces/ICourseControllers"
import { CourseContoller } from "../controllers/course/courseControllers"
import { CourseService } from "../services/course/courseService"
import { ICourseRepository } from "../interfaces/ICourseRepository"
import { CourseRepository } from "../repositories/course/courseRepository"

import { IChapterControllers } from "../interfaces/IChapterControllers"
import { ChapterController } from "../controllers/chapter/chapterControllers"
import { IChapterService } from "../interfaces/IChapterService"
import { ChapterService } from "../services/chapter/chapterService"
import { IChapterRepository } from "../interfaces/IChapterRepository"
import { ChapterRepository } from "../repositories/chapter/chapterRepository"

import { IQuizRepository } from "../interfaces/IQuizRepository"
import { QuizRepository } from "../repositories/quiz/QuizRepository"
import { IQuizService } from "../interfaces/IQuizService"
import { QuizService } from "../services/quiz/QuizService"
import { IQuizController } from "../interfaces/IQuizController"
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