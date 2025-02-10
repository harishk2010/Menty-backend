import upload from "../utils/multer";
import { chapterController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import multer from "multer";

const router = Router();

router.route("/addChapter/:courseId").post(
  upload.single('chapterVideo'),
  chapterController.addChapter.bind(chapterController)
);

router.route("/updateChapter/:chapterId").post(
    upload.single('chapterVideo'),
  chapterController.updateChapter.bind(chapterController)
);

router
  .route("/chapters/:courseId")
  .get(chapterController.getAllChapters.bind(chapterController));

router
  .route("/chapter/:id")
  .get(chapterController.getChapterById.bind(chapterController));

const chapterRoutes = router;
export default chapterRoutes;
