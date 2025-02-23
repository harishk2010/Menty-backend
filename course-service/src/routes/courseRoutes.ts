import upload from "../utils/multer";
import { courseController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import multer from "multer";
import authenticateToken from "../middlewares/AuthenticatedRoutes";

const router = Router();

router.route("/addCourse").post(
  authenticateToken,
  upload.fields([
    { name: "demoVideos", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.addCourse.bind(courseController)
);

router.route("/updateCourse/:courseId").post(
  authenticateToken,
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
  .post(authenticateToken,courseController.buyCourse.bind(courseController));

router
  .route("/course/:id")
  .get(courseController.getCourseById.bind(courseController));
router
  .route("/instructorCourses/:instructorId")
  .get(authenticateToken,courseController.getInstructorCourses.bind(courseController));

router
  .route("/boughtCourses/:id")
  .get(authenticateToken,courseController.getBoughtCourses.bind(courseController));
router
  .route("/boughtCourse/:id")
  .get(authenticateToken,courseController.getBoughtCourseById.bind(courseController));
router
  .route("/playCourseDetails/:id")
  .get(authenticateToken,courseController.coursePlay.bind(courseController));
router
  .route("/handlePublish/:id")
  .put(authenticateToken,courseController.publishCourse.bind(courseController));
router
  .route("/chapterCompleted/:chapterId")
  .put(authenticateToken,courseController.chapterVideoEnd.bind(courseController));

const courseRoutes = router;
export default courseRoutes;
