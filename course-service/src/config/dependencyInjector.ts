import { ICourseService } from "../services/interfaces/ICourseService"
import { ICourseControllers } from "../controllers/interfaces/ICourseControllers"
import { CourseContoller } from "../controllers/course/courseControllers"
import { CourseService } from "../services/course/courseService"
import { ICourseRepository } from "../repositories/interfaces/ICourseRepository"
import { CourseRepository } from "../repositories/course/courseRepository"

import { IChapterControllers } from "../controllers/interfaces/IChapterControllers"
import { ChapterController } from "../controllers/chapter/chapterControllers"
import { IChapterService } from "../services/interfaces/IChapterService"
import { ChapterService } from "../services/chapter/chapterService"
import { IChapterRepository } from "../repositories/interfaces/IChapterRepository"
import { ChapterRepository } from "../repositories/chapter/chapterRepository"

import { IQuizRepository } from "../repositories/interfaces/IQuizRepository"
import { QuizRepository } from "../repositories/quiz/QuizRepository"
import { IQuizService } from "../services/interfaces/IQuizService"
import { QuizService } from "../services/quiz/QuizService"
import { IQuizController } from "../controllers/interfaces/IQuizController"
import { QuizController } from "../controllers/quiz/QuizController"
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository"
import { ReviewRepository } from "../repositories/review/reviewRepository"
import { IReviewService } from "../services/interfaces/IReviewService"
import { ReviewService } from "../services/review/reviewServices"
import { IReviewController } from "../controllers/interfaces/IReviewControllers"
import { ReviewController } from "../controllers/review/reviewControllers"

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

//reviewsAndRatings

const reviewRepository:IReviewRepository=new ReviewRepository()
const reviewService:IReviewService=new ReviewService(reviewRepository)
const reviewController:IReviewController=new ReviewController(reviewService)

export { courseController,chapterController ,quizController,reviewController}