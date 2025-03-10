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
      const { courseId } = req.params;
      const courseData = req.body;
      const files = req.files as {
        demoVideos?: Express.MulterS3.File[];
        thumbnail?: Express.MulterS3.File[];
      };

      if (files?.thumbnail) courseData.thumbnail = files.thumbnail[0].location;
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
        .json({ success: false, message: "Error updating Course" });
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
      res.status(200).json(courses);
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

      res.status(200).json(result);
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
        .status(200)
        .json({
          success: true,
          message: "fetched course categories!",
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
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.status(200).json(course);
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
        res.status(404).json({ message: "Course not found" });
        return;
      }
      const courseId = course.courseId;
      if (!courseId) {
        res.status(404).json({ message: "CourseId not found" });
        return;
      }
      const courseDetails = await this.courseService.getCourseById(
        String(courseId)
      );
      const response = {
        ...course,
        courseDetails,
      };
      res.status(200).json(response);
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
      if (!courseData) throw new Error("No course found");
      if (!courseData.quizId) {
        res.json({
          success: false,
          message: "Add Quiz to Publish Course!",
        });
        return;
      }
      const chapters = await ChapterModel.find({ courseId: id });
      if (chapters.length === 0) {
        res.json({
          success: false,
          message: "Add chapters to Publish Course!",
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

      res.status(200).json({
        success: true,
        message: courseStatus?.isPublished
          ? "Course Published"
          : "Course UnPublished",
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
        throw new Error("no courseData found");
      }
      const listValue = !courseData?.isListed;
      const response = await this.courseService.updateCourse(courseId, {
        ...courseData.toObject(),
        isListed: listValue,
      });
      res.status(200).json({
        success: true,
        message: response?.isListed ? "Course Listed" : "Course unListed",
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
      const { courseId, txnid, amount, courseName } = req.body;
      const isCourseExist = await this.courseService.getCourseById(
        String(courseId)
      );
      if (!isCourseExist) throw new Error("Course not found");

      const instructorPayment = 0.9 * amount;
      const adminPayment = 0.1 * amount;

      const chapters = await this.courseService.getChaptersById(
        String(courseId)
      );
      if (!chapters || chapters.length === 0)
        throw new Error("Chapters not found");

      const completedChapters = chapters.map((chapter: IChapter) => ({
        chapterId: chapter._id,
        isCompleted: false,
      }));
      const userId = await getId("accessToken", req);
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
          .status(200)
          .send({
            message: "Thank you for Enrolling!",
            success: true,
            data: response,
          });
      }
    } catch (error) {
      next(error);
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
        res.status(200).json({
          success: true,
          message: "User courses fetched !",
          data: response,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Something wrong Please try Later!",
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
        res.status(400).json({
          success: false,
          message: "Instructor ID is required",
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
        res.status(404).json({
          success: false,
          message: "No courses found or instructor doesn't exist",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Fetched courses data successfully",
        data: {
          data: result.courses,
          total: result.total,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching courses",
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
          .status(400)
          .send({ message: "Invalid page or limit value", success: false });
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
        .status(200)
        .send({
          message: "Buyed Courses Got Successfully",
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

      if (!purchasedCourse) throw new Error("Purchased course not found");

      const courseData = purchasedCourse.courseId as unknown as ICourse;

      const chaptersData: string[] =
        courseData?.fullVideo?.map(
          (video: { chapterId: string }) => video.chapterId
        ) ?? [];

      if (chaptersData.length === 0) throw new Error("Internal Error");

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

      res.status(200).json({
        success: true,
        message: "Retrieved play data",
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
      if (!chapterId) {
        res
          .status(400)
          .send({
            message: "ChapterId is not provided in the query",
            success: false,
          });
        return;
      }

      const response = await this.courseService.chapterVideoEnd(
        String(chapterId)
      );
      res
        .status(200)
        .send({ success: true, message: "Chapter Completed", data: response });
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
      res.status(200).json({
        success: true,
        message: "Course Deleted!",
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
