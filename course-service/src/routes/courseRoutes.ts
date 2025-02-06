import upload from "../utils/multer";
import { courseController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import multer from "multer";

const router = Router();

router.route('/addCourse')
        .post( upload.fields([
            { name: "demoVideos", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
          ]),courseController.addCourse.bind(courseController))


const courseRoutes = router;
export default courseRoutes;
