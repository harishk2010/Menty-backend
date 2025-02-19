import { ICourse } from "../../models/courseModel";
import { GenericRepository } from "../GenericRepository";
import {CourseModel} from "../../models/courseModel";
import { ICourseRepository } from "./ICourseRepository";
import { ChapterModel, IChapter } from "../../models/chapterModel";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchasedModel";

export class CourseRepository extends GenericRepository<ICourse> implements ICourseRepository {
  constructor() {
    super(CourseModel);
  }

  async getChapterById(id: string): Promise<IChapter[] | null> {
    try {
      const chapters = await ChapterModel.find({ courseId: id });
      return chapters;
    } catch (error) {
      throw error;
    }
  }

  async getInstructorCourses(instructorId: string): Promise<ICourse[]> {
    try {
      const courses = await this.findAll({ mentorId: instructorId });
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async buyCourse(
    userId: string,
    quizId: string,
    courseId: string,
    completedChapters: any,
    txnid: string
  ): Promise<IPurchasedCourse | null> {
    try {
      const courseDetails = await this.findById(courseId);
      if (!courseDetails) throw new Error("Course not found");

      const boughtCourse = await PurchasedCourseModel.findOneAndUpdate(
        { userId, courseId },
        {
          instructorId: courseDetails.mentorId,
          transactionId: txnid,
          completedChapters,
          quizId,
          isCourseCompleted: false,
        },
        { upsert: true, new: true }
      );

      return boughtCourse;
    } catch (error) {
      throw error;
    }
  }

  async getBoughtCourses(userId: string, page: number, limit: number): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const response = await PurchasedCourseModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("courseId", "courseName level thumbnailUrl quizId")
        .exec();

      const totalCourses = await PurchasedCourseModel.countDocuments({ userId });

      return {
        courses: response,
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses: totalCourses,
      };
    } catch (error) {
      throw error;
    }
  }

  async chapterVideoEnd(chapterId: string): Promise<any> {
    try {
      const findChapter = await PurchasedCourseModel.findOne({
        "completedChapters.chapterId": chapterId,
      });

      if (!findChapter) throw new Error("Purchased Course not Found");

      const chapterIndex = findChapter.completedChapters.findIndex(
        (chapter) => chapter.chapterId.toString() === chapterId
      );

      if (chapterIndex === -1) throw new Error("Chapter Not Found");

      findChapter.completedChapters[chapterIndex].isCompleted = true;
      const updatedChapters = await findChapter.save();

      return updatedChapters;
    } catch (error) {
      throw error;
    }
  }
}