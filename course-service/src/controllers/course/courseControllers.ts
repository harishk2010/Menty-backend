import { NextFunction, Request, Response } from "express";
import { ICourseControllers } from "../interfaces/ICourseControllers";
import { ICourseService } from "../../services/interfaces/ICourseService";
import produce from "../../config/kafka/producer";
import getId from "../../utils/getId";
import {
  IPurchasedCourse,
  PurchasedCourseModel,
} from "../../models/purchasedModel";
import { CourseModel, ICourse } from "../../models/courseModel";
import { ChapterModel, IChapter } from "../../models/chapterModel";
import { generateSignedUrl } from "../../utils/signedUrlGenerator";
import { IBoughtCourses } from "../../Types/updateRequestType";
import { IUser } from "../../models/userModel";
import { CourseErrorMessages, CourseSuccessMessages } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";

export class CourseContoller implements ICourseControllers {
  constructor(private courseService: ICourseService) {}

  async addCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const courseData = req.body;
      const files = req.files as {
        demoVideos?: Express.MulterS3.File[];
        thumbnail?: Express.MulterS3.File[];
      };
      const mentorId = await getId("accessToken", req);
      courseData.mentorId = mentorId;

      if (!files?.thumbnail || !files?.demoVideos) {
        res.status(StatusCode.BAD_REQUEST).json({ message: CourseErrorMessages.MISSING_FILES });
        return;
      }

      const thumbnailUrl = files.thumbnail[0].location;
      const demoVideoUrl = files.demoVideos[0].location;

      const newCourse = await this.courseService.createCourse({
        ...courseData,
        thumbnailUrl,
        demoVideo: { type: "video", url: demoVideoUrl },
      });

      res
        .status(StatusCode.CREATED)
        .json({
          success: true,
          message: CourseSuccessMessages.COURSE_CREATED,
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
      const { courseId } = req.params;
      const courseData = req.body;
      const files = req.files as {
        demoVideos?: Express.MulterS3.File[];
        thumbnail?: Express.MulterS3.File[];
      };
    
      if (files?.thumbnail) courseData.thumbnailUrl = files.thumbnail[0].location;
      if (files?.demoVideos)
        courseData.demoVideo = {
          type: "video",
          url: files.demoVideos[0].location,
        };
    
      const updatedCourse = await this.courseService.updateCourse(
        courseId,
        courseData
      );
      if (updatedCourse) {
        res
          .status(StatusCode.OK)
          .json({
            success: true,
            message: CourseSuccessMessages.COURSE_UPDATED,
            data: updatedCourse,
          });
        return;
      }
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: CourseErrorMessages.INTERNAL_ERROR });
    } catch (error) {
      next(error);
    }
  }

  async getAllCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(StatusCode.OK).json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getPaginatedCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const sort = (req.query.sort as string) || "popular";

      let category: string[] = [];
      let level: string[] = [];

      if (req.query.category) {
        category = Array.isArray(req.query.category)
          ? (req.query.category as string[])
          : [req.query.category as string];
      }

      if (req.query.level) {
        level = Array.isArray(req.query.level)
          ? (req.query.level as string[])
          : [req.query.level as string];
      }

      // Get paginated, sorted, and filtered courses
      const result = await this.courseService.getPaginatedCourses(
        page,
        limit,
        search,
        sort,
        category,
        level
      );

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCourseCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Fetch all unique categories from listed courses
      const categories = await CourseModel.distinct("category", {
        isListed: true,
      });

      res
        .status(StatusCode.OK)
        .json({
          success: true,
          message: CourseSuccessMessages.COURSE_CATEGORIES_FETCHED,
          data: categories,
        });
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.courseService.getCourseById(id);
      if (!course) {
        res.status(StatusCode.NOT_FOUND).json({ message: CourseErrorMessages.COURSE_NOT_FOUND });
        return;
      }
      res.status(StatusCode.OK).json(course);
    } catch (error) {
      next(error);
    }
  }
  async getBoughtCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.courseService.getBoughtCourseById(id);
      if (!course) {
        res.status(StatusCode.NOT_FOUND).json({ message: CourseErrorMessages.COURSE_NOT_FOUND });
        return;
      }
      const courseId = course.courseId;
      if (!courseId) {
        res.status(StatusCode.NOT_FOUND).json({ message: CourseErrorMessages.COURSE_ID_NOT_FOUND });
        return;
      }
      const courseDetails = await this.courseService.getCourseById(
        String(courseId)
      );
      const response = {
        ...course,
        courseDetails,
      };
      res.status(StatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async publishCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const courseData = await this.courseService.getCourseById(id);
      if (!courseData) throw new Error(CourseErrorMessages.COURSE_NOT_FOUND);
      if (!courseData.quizId) {
        res.json({
          success: false,
          message: CourseErrorMessages.ADD_QUIZ_TO_PUBLISH,
        });
        return;
      }
      const chapters = await ChapterModel.find({ courseId: id });
      if (chapters.length === 0) {
        res.json({
          success: false,
          message: CourseErrorMessages.ADD_CHAPTERS_TO_PUBLISH,
        });
        return;
      }

      const updatedCourseData = {
        ...courseData.toObject(),
        isPublished: !courseData.isPublished,
      };
      const courseStatus = await this.courseService.updateCourse(
        id,
        updatedCourseData
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: courseStatus?.isPublished
          ? CourseSuccessMessages.COURSE_PUBLISHED
          : CourseSuccessMessages.COURSE_UNPUBLISHED,
      });
    } catch (error) {
      next(error);
    }
  }
  public async listOrUnlistCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const courseData = await this.courseService.getCourseById(courseId);
      if (!courseData) {
        throw new Error(CourseErrorMessages.COURSE_NOT_FOUND);
      }
      const listValue = !courseData?.isListed;
      const response = await this.courseService.updateCourse(courseId, {
        ...courseData.toObject(),
        isListed: listValue,
      });
      res.status(StatusCode.OK).json({
        success: true,
        message: response?.isListed ? CourseSuccessMessages.COURSE_LISTED : CourseSuccessMessages.COURSE_UNLISTED,
      });
    } catch (error) {
      next(error);
    }
  }

  public async buyCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {userId, courseId, txnid, amount, courseName } = req.body;
      const isCourseExist = await this.courseService.getCourseById(
        String(courseId)
      );
      if (!isCourseExist) throw new Error(CourseErrorMessages.COURSE_NOT_FOUND);

      const instructorPayment = 0.9 * amount;
      const adminPayment = 0.1 * amount;

      const chapters = await this.courseService.getChaptersById(
        String(courseId)
      );
      if (!chapters || chapters.length === 0)
        throw new Error(CourseErrorMessages.CHAPTERS_NOT_FOUND);

      const completedChapters = chapters.map((chapter: IChapter) => ({
        chapterId: chapter._id,
        isCompleted: false,
      }));
      // const userId = await getId("accessToken", req);
      const quizId = isCourseExist.quizId;
      const price = amount;
      const response = await this.courseService.buyCourse(
        String(userId),
        String(quizId),
        String(isCourseExist._id),
        completedChapters,
        String(txnid),
        Number(price)
      );
      if (response) {
        produce("update-instructor-wallet", {
          instructorId: isCourseExist.mentorId,
          txnid,
          amount: instructorPayment,
          type: "credit",
          description: `Payment Received for Course:${courseName}`,
        });
        produce("update-admin-wallet", {
          instructorId: isCourseExist.mentorId,
          txnid,
          amount: adminPayment,
          type: "credit",
          description: `Payment Received for Course:${courseName}`,
        });

        res
          .status(StatusCode.OK)
          .send({
            message: CourseSuccessMessages.THANK_YOU_FOR_ENROLLING,
            success: true,
            data: response,
          });
      }
    } catch (error) {
      next(error);
    }
  }
   public async isBoughtCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {userId} = req.body
      const { courseId } = req.params;
 
      const response = await this.courseService.isBoughtCourse(
        String(userId),
        courseId
      );
      if(response){
      res.status(StatusCode.OK).json({
        success: true,
        message: CourseSuccessMessages.COURSE_ALREADY_PURCHASED,
        data: {
          isBought:true
        },
      })

    }else{
      res.json({
        success: false,
        data: {
          isBought:false
        },
      })
    }
      
    } catch (error) {
      throw error
      
    }
  }
  public async getInstructorCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { instructorId } = req.params;
      const response = await this.courseService.getInstructorCourses(
        instructorId
      );

      if (response) {
        res.status(StatusCode.OK).json({
          success: true,
          message: CourseSuccessMessages.COURSE_FETCHED,
          data: response,
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: CourseErrorMessages.INTERNAL_ERROR,
          data: response,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getFilteredInstructorCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        instructorId,
        page = 1,
        limit = 10,
        search = "",
        sortField = "lastUpdated",
        sortOrder = "desc",
      } = req.query;

      if (!instructorId) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: CourseErrorMessages.INSTRUCTOR_ID_REQUIRED,
        });
        return;
      }

      const result = await this.courseService.getInstructorCoursesList(
        String(instructorId),
        Number(page),
        Number(limit),
        String(search),
        String(sortField),
        String(sortOrder) as "asc" | "desc"
      );

      if (!result) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: CourseErrorMessages.NO_COURSE_DATA_FOUND,
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: CourseSuccessMessages.COURSES_FETCHED,
        data: {
          data: result.courses,
          total: result.total,
        },
      });
    } catch (error: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: CourseErrorMessages.INTERNAL_ERROR,
        error: error.message,
      });
      throw error;
    }
  }

  public async getBoughtCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1, limit = 4 } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (pageNumber < 1 || limitNumber < 1) {
        res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: CourseErrorMessages.INVALID_PAGE_OR_LIMIT, success: false });
        return;
      }

      const userId = await getId("accessToken", req);
      const response = await this.courseService.getBoughtCourses(
        String(userId),
        pageNumber,
        limitNumber
      );

      response.courses = response.courses.map((course: IBoughtCourses) => ({
        _id: course._id,
        courseDetails: {
          courseName: course?.courseId.courseName,
          level: course.courseId.level,
          thumbnailUrl: course.courseId.thumbnailUrl,
          quizId: course.courseId.quizId,
        },
        completedChapters: course.completedChapters,
        isCourseCompleted: course.isCourseCompleted,
        purchasedAt: course.purchasedAt,
      }));

      res
        .status(StatusCode.OK)
        .send({
          message:CourseSuccessMessages.BOUGHT_COURSES_FETCHED,
          success: true,
          data: response,
        });
    } catch (error) {
      next(error);
    }
  }
  public async completedCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1, limit = 4 } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (pageNumber < 1 || limitNumber < 1) {
        res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: CourseErrorMessages.INVALID_PAGE_OR_LIMIT, success: false });
        return;
      }

      const userId = await getId("accessToken", req);
      const response = await this.courseService.getBoughtCourses(
        String(userId),
        pageNumber,
        limitNumber
      );

      response.courses = response.courses.map((course: IBoughtCourses) => ({
        _id: course._id,
        courseDetails: {
          courseName: course?.courseId.courseName,
          level: course.courseId.level,
          thumbnailUrl: course.courseId.thumbnailUrl,
          quizId: course.courseId.quizId,
        },
        completedChapters: course.completedChapters,
        isCourseCompleted: course.isCourseCompleted,
        purchasedAt: course.purchasedAt,
      })).filter((course: IBoughtCourses) => course.isCourseCompleted);

      res
        .status(StatusCode.OK)
        .send({
          message:CourseSuccessMessages.BOUGHT_COURSES_FETCHED,
          success: true,
          data: response,
        });
    } catch (error) {
      next(error);
    }
  }

  public async coursePlay(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const purchasedCourse = (await PurchasedCourseModel.findById(id)
        .populate({
          path: "courseId",
          select: "courseName duration level description category thumbnailUrl",
          populate: {
            path: "fullVideo.chapterId",
            model: "Chapter",
            select:
              "chapterTitle courseId chapterNumber description videoUrl captionsUrl createdAt",
          },
        })
        .exec()) as unknown as IPurchasedCourse;

      if (!purchasedCourse) throw new Error(CourseErrorMessages.NO_COURSE_DATA_FOUND);

      const courseData = purchasedCourse.courseId as unknown as ICourse;

      const chaptersData: string[] =
        courseData?.fullVideo?.map(
          (video: { chapterId: string }) => video.chapterId
        ) ?? [];

      if (chaptersData.length === 0) throw new Error(CourseErrorMessages.INTERNAL_ERROR);

      const chapters: IChapter[] = await ChapterModel.find({
        _id: { $in: chaptersData },
      });

      const chaptersWithSignedUrls = await Promise.all(
        chapters.map(async (chapter: IChapter) => {
          const chapterObject = chapter.toObject();

          if (chapter.videoUrl) {
            chapterObject.videoUrl = await generateSignedUrl(chapter.videoUrl);
          }

          if (chapter.captionsUrl) {
            chapterObject.captionsUrl = await generateSignedUrl(
              chapter.captionsUrl
            );
          }

          return chapterObject;
        })
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: CourseSuccessMessages.PLAY_DATA_RETRIEVED,
        data: {
          purchasedCourse,
          course: {
            courseName: courseData?.courseName,
            duration: courseData?.duration,
            level: courseData?.level,
            description: courseData?.description,
            category: courseData?.category,
            thumbnailUrl: courseData?.thumbnailUrl,
          },
          chapters: chaptersWithSignedUrls,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async chapterVideoEnd(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { chapterId } = req.params;
      const { courseId } = req.params;
      if (!chapterId) {
        res
          .status(StatusCode.BAD_REQUEST)
          .send({
            message: CourseErrorMessages.CHAPTER_ID_REQUIRED,
            success: false,
          });
        return;
      }

      const response = await this.courseService.chapterVideoEnd(
        String(courseId),
        String(chapterId)
      );
      res
        .status(StatusCode.OK)
        .send({ success: true, message: CourseSuccessMessages.CHAPTER_COMPLETED, data: response });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const deletedCourse = await this.courseService.deleteCourseById(courseId);
      res.status(StatusCode.OK).json({
        success: true,
        message: CourseSuccessMessages.COURSE_DELETED,
        data: deletedCourse,
      });
    } catch (error) {
      next(error);
    }
  }
  public async addStudent(payload: IUser): Promise<void> {
    try {
      let response = await this.courseService.createStudent(payload);
    } catch (error) {
      throw error;
    }
  }
}
