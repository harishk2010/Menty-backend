import { NextFunction, Request, Response } from "express";
import { ICourseControllers } from "../course/ICourseControllers";
import { ICourseService } from "../../services/course/ICourseService";
import produce from "../../config/kafka/producer";
import getId from "../../utils/getId";
import { IChapterService } from "../../services/chapter/IChapterService";
import { ChapterService } from "../../services/chapter/chapterService";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchasedModel";
import { ICourse } from "../../models/courseModel";
import { QuizModel } from "../../models/quizModel";
import kafka from "@/config/kafka/kafkaConfig";

export class CourseContoller implements ICourseControllers {
  constructor(private courseService: ICourseService) {}

  async addCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseData = req.body;
      const files = req.files as { demoVideos?: Express.MulterS3.File[]; thumbnail?: Express.MulterS3.File[] };
      const mentorId = await getId("accessToken", req);
      courseData.mentorId = mentorId;

      if (!files?.thumbnail || !files?.demoVideos) {
        res.status(400).json({ message: "Missing files" });
        return;
      }

      const thumbnailUrl = files.thumbnail[0].location;
      const demoVideoUrl = files.demoVideos[0].location;

      const newCourse = await this.courseService.createCourse({
        ...courseData,
        thumbnailUrl,
        demoVideo: { type: "video", url: demoVideoUrl },
      });

      res.status(201).json({ success: true, message: "Course created successfully", data: newCourse });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const courseData = req.body;
      const files = req.files as { demoVideos?: Express.MulterS3.File[]; thumbnail?: Express.MulterS3.File[] };

      if (files?.thumbnail) courseData.thumbnail = files.thumbnail[0].location;
      if (files?.demoVideos) courseData.demoVideo = { type: "video", url: files.demoVideos[0].location };

      const updatedCourse = await this.courseService.updateCourse(courseId, courseData);
      if (updatedCourse) {
        res.status(201).json({ success: true, message: "Course updated successfully", data: updatedCourse });
        return;
      }
      res.status(500).json({ success: false, message: "Error updating Course" });
    } catch (error) {
      next(error);
    }
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    try {
      const { id } = req.params;
      const courseData = await this.courseService.getCourseById(id);
      if (!courseData) throw new Error("No course found");

      const updatedCourseData = { ...courseData.toObject(), isPublished: !courseData.isPublished };
      const courseStatus = await this.courseService.updateCourse(id, updatedCourseData);

      res.status(200).json({
        success: true,
        message: courseStatus?.isPublished ? "Course Published" : "Course UnPublished",
      });
    } catch (error) {
      next(error);
    }
  }

  public async buyCourse(req: Request, res: Response, next:NextFunction): Promise<any> {
    try {
      const { courseId, txnid ,amount ,courseName } = req.body;
      console.log(req.body,"=====================\\\\\\\\")
      const isCourseExist = await this.courseService.getCourseById(String(courseId));
      if (!isCourseExist) throw new Error("Course not found");
      

      const instructorPayment=(0.9*amount)
      console.log(instructorPayment,amount,"=>>")
      const adminPayment=(0.1*amount)

      const chapters = await this.courseService.getChaptersById(String(courseId));
      if (!chapters || chapters.length === 0) throw new Error("Chapters not found");

      const completedChapters = chapters.map((chapter: any) => ({ chapterId: chapter._id, isCompleted: false }));
      const userId = await getId("accessToken", req);
      const quizId=isCourseExist.quizId
      const response = await this.courseService.buyCourse(String(userId),String(quizId), String(isCourseExist._id), completedChapters, String(txnid));
      console.log(response,"response buyed")
      if(response){
       produce('update-instructor-wallet',{instructorId:isCourseExist.mentorId,txnid,amount:instructorPayment,type:'credit',description:`Payment Received for Course:${courseName}`})

        res.status(200).send({ message: "Thank you for Enrolling!", success: true, data: response });
      }
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
  public async getInstructorCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {instructorId}=req.params
      const response=await this.courseService.getInstructorCourses(instructorId)
      if(response){
        res.status(200).json({
          success:true,
          message:"User courses fetched !",
          data:response
        })
      }else{
        res.status(500).json({
          success:false,
          message:"Something wrong Please try Later!",
          data:response
        })

      }
      
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public async getBoughtCourses(req: Request, res: Response, next:NextFunction): Promise<any> {
    try {
      const { page = 1, limit = 4 } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (pageNumber < 1 || limitNumber < 1) {
        res.status(400).send({ message: "Invalid page or limit value", success: false });
        return;
      }

      const userId = await getId("accessToken", req);
      const response = await this.courseService.getBoughtCourses(String(userId), pageNumber, limitNumber);

      response.courses = response.courses.map((course: any) => ({
        _id: course._id,
        courseDetails: {
          courseName: course.courseId.courseName,
          level: course.courseId.level,
          thumbnailUrl: course.courseId.thumbnailUrl,
          quizId:course.courseId.quizId
        },
        completedChapters: course.completedChapters,
        isCourseCompleted: course.isCourseCompleted,
        purchasedAt: course.purchasedAt,
      }));
      console.log("===>",response.courses)

      res.status(200).send({ message: "Buyed Courses Got Successfully", success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  public async coursePlay(req: Request, res: Response, next:NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const purchasedCourse = (await PurchasedCourseModel.findById(id)
        .populate({
          path: "courseId",
          select: "courseName duration level description category thumbnailUrl",
          populate: { path: "fullVideo.chapterId", model: "Chapter", select: "chapterTitle courseId chapterNumber description videoUrl createdAt" },
        })
        .exec() as unknown as IPurchasedCourse)

      if (!purchasedCourse) throw new Error("Purchased course not found");

      const courseData = purchasedCourse.courseId as unknown as ICourse;
      const chaptersData = courseData?.fullVideo?.map((video: any) => video.chapterId);

      res.status(200).json({
        success: true,
        message: "retrived play data",
        data: { purchasedCourse, course: { courseName: courseData?.courseName, duration: courseData?.duration, level: courseData?.level, description: courseData?.description, category: courseData?.category, thumbnailUrl: courseData?.thumbnailUrl }, chapters: chaptersData },
      });
    } catch (error) {
      next(error);
    }
  }

  public async chapterVideoEnd(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const { chapterId } = req.params;
      if (!chapterId) {
        res.status(400).send({ message: "ChapterId is not provided in the query", success: false });
        return;
      }

      const response = await this.courseService.chapterVideoEnd(String(chapterId));
      res.status(200).send({ success: true, message: "Chapter Completed", data: response });
    } catch (error) {
      next(error);
    }
  }

  public async addQuiz(req:Request,res:Response,nxt:NextFunction):Promise<void>{
    try {

      const quizData=req.body

     
      const savedQuiz = await QuizModel.create(quizData);
      const courseData = await this.courseService.getCourseById(quizData.courseId);
      if (!courseData) throw new Error("No course found");

      const updatedCourseData = { ...courseData.toObject(), quizId:savedQuiz._id};
      
     

        await this.courseService.updateCourse(String(savedQuiz.courseId),updatedCourseData)
      

      res.status(201).json({
        success:true,
        message:"Quiz added to the Course",
        data:savedQuiz

      });


      
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  public async editQuiz(req:Request,res:Response,nxt:NextFunction):Promise<void>{
    try {
      console.log(req.params,req.body,"bodyyy")
      const updatedQuiz = await QuizModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          
        }
      );
      console.log(updatedQuiz,"updateddd")
      if (!updatedQuiz) {
        res.status(404).json({ 
          success:false,
          message: "Quiz not found" });
        return;
      }
      res.status(200).json({
        success:true,
        message:"updated quizz successfully!",
        data:updatedQuiz});
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }
  public async getQuiz(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {

      const {quizId}=req.params

      console.log(quizId,"quizID")
     
      const savedQuiz = await QuizModel.findById(quizId);
      console.log("saved",savedQuiz)
      res.status(201).json({
        success:true,
        message:"Quiz added to the Course",
        data:savedQuiz

      });


      
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public async submitResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const {courseId}=req.params
      const {score,total}=req.body
      console.log(score,total,"=====>final score")

      if(!courseId)  throw new Error("courseId not found");
      if(!score || !total)  throw new Error("finalscore not found");
      const userId = await getId("accessToken", req);
      const percentage=(score/total)*100
      const Pass=percentage>40
      if(Pass){
        const courseData = await PurchasedCourseModel.findOneAndUpdate({
          courseId,userId
        },{
          isCourseCompleted:true
        },{
          new:true
        })
        // await this.courseService.updateCourse(courseId,{})
        res.status(200).json({
          success:true,
          message:"Course Cmmpleted!",
          data:courseData
        })
      }else{
        res.status(400).json({
          success:false,
          message:"Retry Quiz!"
        })
        return
      }

      // console.log(Pass,"pass")

      
      
      
    } catch (error) {
      console.log(error)
      throw error
    }
  }


}