import upload from "../utils/multer";
import { chapterController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import multer from "multer";
import authenticateToken from "../middlewares/AuthenticatedRoutes";

const router = Router();

router.route("/addChapter/:courseId").post(authenticateToken,
  upload.single('chapterVideo'),
  chapterController.addChapter.bind(chapterController)
);

router.route("/updateChapter/:chapterId").post(
  authenticateToken,
    upload.single('chapterVideo'),
  chapterController.updateChapter.bind(chapterController)
);

router
  .route("/chapters/:courseId")
  .get(
    authenticateToken,
    chapterController.getAllChapters.bind(chapterController));

router
  .route("/chapter/:id")
  .get(authenticateToken,chapterController.getChapterById.bind(chapterController));

const chapterRoutes = router;
export default chapterRoutes;
