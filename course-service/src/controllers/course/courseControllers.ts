import { NextFunction, Request, Response } from "express";
import { ICourseControllers } from "../course/ICourseControllers";
import { ICourseService } from "../../services/course/ICourseService";
import produce from "../../config/kafka/producer";
import getId from "../../utils/getId";

export class CourseContoller implements ICourseControllers {
  private courseService: ICourseService;

  constructor(courseService: ICourseService) {
    this.courseService = courseService;
  }


  async addCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseData = req.body;
      console.log("courseData",courseData)
            const files = req.files as {
        demoVideos?: Express.MulterS3.File[];
        thumbnail?: Express.MulterS3.File[];
      };
      const mentorId=await getId('accessToken', req)
      console.log(mentorId,"mentorID")
      courseData.mentorId=mentorId

      if (!files?.thumbnail || !files?.demoVideos) {
        res.status(400).json({ message: "Missing files" });
        return 
      }
   

      // Prepare file URLs
      const thumbnailUrl = files.thumbnail[0].location;
          const demoVideoUrl = files.demoVideos[0].location;
      // Add course data including URLs to the service layer
      const newCourse = await this.courseService.createCourse({
        ...courseData,
        thumbnailUrl,
        demoVideo: { type: 'video', url: demoVideoUrl },
      });

      res.status(201).json({success:true, message: 'Course created successfully', data: newCourse });
    } catch (error) {
      next(error);
    }
  }

  // Fetch all courses
  async getAllCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  // Fetch a single course by ID
  async getCourseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.courseService.getCourseById(id);
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return
      }
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

  
}
