import upload from "../utils/multer";
import { courseController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import multer from "multer";

const router = Router();

router.route("/addCourse").post(
  upload.fields([
    { name: "demoVideos", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.addCourse.bind(courseController)
);

router.route("/updateCourse/:courseId").post(
  upload.fields([
    { name: "demoVideos", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.updateCourse.bind(courseController)
);

router
  .route("/courses")
  .get(courseController.getAllCourses.bind(courseController));
router
  .route("/payment")
  .post(courseController.buyCourse.bind(courseController));

router
  .route("/course/:id")
  .get(courseController.getCourseById.bind(courseController));
router
  .route("/boughtCourses/:id")
  .get(courseController.getBoughtCourses.bind(courseController));
router
  .route("/playCourseDetails/:id")
  .get(courseController.coursePlay.bind(courseController));
router
  .route("/handlePublish/:id")
  .put(courseController.publishCourse.bind(courseController));
router
  .route("/chapterCompleted/:chapterId")
  .put(courseController.chapterVideoEnd.bind(courseController));
router
  .route("/addQuiz")
  .post(courseController.addQuiz.bind(courseController));
router
  .route("/editQuiz")
  .post(courseController.editQuiz.bind(courseController));
router
  .route("/getQuiz/:quizId")
  .get(courseController.getQuiz.bind(courseController));

const courseRoutes = router;
export default courseRoutes;
