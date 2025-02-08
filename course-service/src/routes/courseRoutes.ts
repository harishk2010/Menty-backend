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
  .route("/course/:id")
  .get(courseController.getCourseById.bind(courseController));
router
  .route("/handlePublish/:id")
  .put(courseController.publishCourse.bind(courseController));

const courseRoutes = router;
export default courseRoutes;
