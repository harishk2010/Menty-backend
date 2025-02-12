import { NextFunction, Request, Response } from "express";
import { ICourseControllers } from "../course/ICourseControllers";
import { ICourseService } from "../../services/course/ICourseService";
import produce from "../../config/kafka/producer";
import getId from "../../utils/getId";
import { IChapterService } from "../../services/chapter/IChapterService";
import { ChapterService } from "../../services/chapter/chapterService";
import { error } from "console";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchasedModel";
import { ICourse } from "../../models/courseModel";

export class CourseContoller implements ICourseControllers {
  private courseService: ICourseService;
    // private chapterService: ChapterService;

  constructor(courseService: ICourseService) {
    this.courseService = courseService;
    // this.chapterService = new ChapterService() ;
  }

  async addCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const courseData = req.body;
      console.log("courseData", courseData);
      const files = req.files as {
        demoVideos?: Express.MulterS3.File[];
        thumbnail?: Express.MulterS3.File[];
      };
      const mentorId = await getId("accessToken", req);
      console.log(mentorId, "mentorID");
      courseData.mentorId = mentorId;

      if (!files?.thumbnail || !files?.demoVideos) {
        res.status(400).json({ message: "Missing files" });
        return;
      }

      // Prepare file URLs
      const thumbnailUrl = files.thumbnail[0].location;
      const demoVideoUrl = files.demoVideos[0].location;
      // Add course data including URLs to the service layer
      const newCourse = await this.courseService.createCourse({
        ...courseData,
        thumbnailUrl,
        demoVideo: { type: "video", url: demoVideoUrl },
      });

      res
        .status(201)
        .json({
          success: true,
          message: "Course created successfully",
          data: newCourse,
        });
    } catch (error) {
      next(error);
    }
  }
  async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {courseId} = req.params;
      const  courseData  = req.body;
      
      console.log("courseData & id", courseData ,courseId);
      const files = req.files as {
        demoVideos?: Express.MulterS3.File[];
        thumbnail?: Express.MulterS3.File[];
      };

      if (files?.thumbnail) {
        courseData.thumbnail = files.thumbnail[0].location;
      }
      if (files?.demoVideos) {
        courseData.demoVideo = {
          type: "video",
          url: files.demoVideos[0].location,
        };
      }

      // Add course data including URLs to the service layer
      const updatedCourse = await this.courseService.updateCourse(
        courseId,
        courseData
      );
      if (updatedCourse) {
        res
          .status(201)
          .json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
          });
        return;
      }
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating Course",
         
        });
    } catch (error) {
      next(error);
    }
  }

  // Fetch all courses
  async getAllCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  // Fetch a single course by ID
  async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.courseService.getCourseById(id);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

async publishCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try{
  const { id }=req.params

      const courseData=await this.courseService.getCourseById(id)

      if(!courseData){
        throw new Error("No course found")
      }
      const updatedCourseData = {
        ...courseData.toObject(), 
        isPublished: !courseData.isPublished,  
      };
      const courseStatus=await this.courseService.updateCourse(id,updatedCourseData)


      if(courseStatus?.isPublished){
        res.status(200).json({
          success:true,
          message:"Course Published"
        })
      }else{
        res.status(200).json({
          success:true,
          message:"Course UnPublished"
        })

      }
      
    } catch (error) {
      console.log(error);
      throw error;
      
      
    }
}

public async buyCourse(req: Request, res: Response): Promise<any> {
  try {

      const { courseId, txnid, amount, courseName } = req.body

      const isCourseExist = await this.courseService.getCourseById(String(courseId))
      console.log(req.body,isCourseExist,"buy")

      if (isCourseExist) {
          const chapters = await this.courseService.getChaptersById(String(courseId))
          if(!chapters){
            throw new Error("chapters not found")
          }
          console.log(chapters,"chapters")

          if (chapters?.length !== 0 ) {

              const completedChapters = chapters.map((chapter: any) => ({
                  chapterId: chapter._id,
                  isCompleted: false,
              }));

              const userId = await getId('accessToken', req)
              console.log("response before",completedChapters)

              const response = await this.courseService.buyCourse(String(userId), String(isCourseExist._id), completedChapters, String(txnid))
              console.log(response,"responseeee")
              
              return res
                  .status(200)
                  .send({
                      message: 'Thank you for Enrolling!',
                      success: true,
                      data: response
                  })
          }
      }

  } catch (error: any) {
    console.log(error)
      throw error
  }
}

public async getBoughtCourses(req: Request, res: Response): Promise<any> {
  try {

      const { page = 1, limit = 4 } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (pageNumber < 1 || limitNumber < 1) {
          const error = new Error('Invalid page or limit value')
          error.name = 'Invalid page or limit value'
          throw error
      }

  
      const userId = await getId('accessToken', req)


      const response = await this.courseService.getBoughtCourses(String(userId), pageNumber, limitNumber);

      // Format the response
      const formattedResponse = response.courses.map((course: any) => ({
          _id: course._id,
          courseDetails: {
              courseName: course.courseId.courseName,
              level: course.courseId.level,
              thumbnailUrl:course.courseId.thumbnailUrl,
              // instructor:{
              //   username:course.instructorId.username
              // }
          },
          completedChapters: course.completedChapters,
          isCourseCompleted: course.isCourseCompleted,
          purchasedAt: course.purchasedAt,
          
      }));

      // Update the courses in the response object
      response.courses = formattedResponse;

      // Send the response
      return res.status(200).send({
          message: "Buyed Courses Got Successfully",
          success: true,
          data: response,
      });
  } catch (error: any) {
      if (error instanceof Error) {
          if (error.name === 'Invalid page or limit value') {
              return res.status(400).send({
                  message: "Invalid page or limit value",
                  success: false,
              });
          }
      }
      throw error
  }
}

public async coursePlay(req: Request, res: Response): Promise<any> {
  try {

    const {id}=req.params
      // Find the purchased course and populate course and chapters
      const purchasedCourse = await PurchasedCourseModel.findById(id)
          .populate({
              path: 'courseId', // Populate course details
              select: 'courseName duration level description category thumbnailUrl', // Select specific fields from Course
              populate: {
                  path: 'fullVideo.chapterId', // Populate chapters from Course
                  model: 'Chapter', // Specify the Chapter model
                  select: 'chapterTitle courseId chapterNumber description videoUrl createdAt', // Select specific fields
              },
          })
          .exec() as unknown as IPurchasedCourse

      if (!purchasedCourse) {
          throw new Error('Purchased course not found');
      }

      // Extract data
      const courseData = purchasedCourse.courseId as unknown as ICourse
      const chaptersData = courseData?.fullVideo?.map((video: any) => video.chapterId);

      // Format the response
      const data= {
          purchasedCourse, // All data from the purchased course
          course: {
              courseName: courseData?.courseName,
              duration: courseData?.duration,
              level: courseData?.level,
              description: courseData?.description,
              category: courseData?.category,
              thumbnailUrl: courseData?.thumbnailUrl,
          },
          chapters: chaptersData, // All chapter data
      };

      console.log(data)

      res.status(200).json({
        success:true,
        message:"retrived play data",
        data
        
      })
  } catch (error: any) {
      throw error
  }
}



}
