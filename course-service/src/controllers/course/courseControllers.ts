import { NextFunction, Request, Response } from "express";
import { ICourseControllers } from "../course/ICourseControllers";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import { ICourseService } from "../../services/course/ICourseService";
import produce from "../../config/kafka/producer";

export class CourseContoller implements ICourseControllers {
  private courseService: ICourseService;

  constructor(courseService: ICourseService) {
    this.courseService = courseService;
  }

  async addCourse(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
      console.log("Received Request Body:", req.body);
      console.log("Received Files:", req.files);

      const files = req.files as { demoVideos?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] };
      const demoVideoFile = files?.demoVideos ? files.demoVideos[0] : null;
      const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : null;

      console.log("Extracted Demo Video:", demoVideoFile);
      console.log("Extracted Thumbnail File:", thumbnailFile);

      res.status(200).json({ message: "Course added successfully", demoVideoFile, thumbnailFile });

  } catch (error) {
      console.error("Error processing uploaded files:", error);
      next(error);
  }
  }

  
}
