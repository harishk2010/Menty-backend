import { ICourse } from "../../models/courseModel";
import { GenericRepository } from "../GenericRepository";
import { CourseModel } from "../../models/courseModel";
import { ICourseRepository } from "../interfaces/ICourseRepository";
import { ChapterModel, IChapter } from "../../models/chapterModel";
import {
  IPurchasedCourse,
  PurchasedCourseModel,
} from "../../models/purchasedModel";
import { QuizModel } from "../../models/quizModel";
import { Paginatedcourses } from "../../Types/updateRequestType";
import { CourseErrorMessages } from "../../utils/constants";

export class CourseRepository
  extends GenericRepository<ICourse>
  implements ICourseRepository
{
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
  async getInstructorCoursesList(
    instructorId: string,
    page: number,
    limit: number,
    search: string = "",
    sortField: string = "lastUpdated",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{ courses: ICourse[]; total: number } | null> {
    try {
      let query: any = { mentorId: instructorId };

      if (search) {
        const searchRegex = new RegExp(search, "i");

        query = {
          $and: [
            { mentorId: instructorId },
            {
              $or: [
                { courseName: searchRegex },
                { category: searchRegex },
                { level: searchRegex },
                { description: searchRegex },
              ],
            },
          ],
        };

        if (!isNaN(Number(search))) {
          query.$and[1].$or.push({ price: Number(search) });
        }
      }

      const total = await CourseModel.countDocuments(query);

      const sort: any = {};
      sort[sortField] = sortOrder === "asc" ? 1 : -1;

      const skip = (page - 1) * limit;

      const courses = await CourseModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      return {
        courses,
        total,
      };
    } catch (error) {
      
      throw error;
    }
  }
  async isBoughtCourse(userId: string, courseId: string): Promise<IPurchasedCourse | null> {
    try {
      const course = await PurchasedCourseModel.findOne({ userId, courseId });
      return course;
      
    } catch (error) {
      throw error;
      
    }
  }
  async getPaginatedCourses(
    page: number,
    limit: number,
    search: string,
    sort: string,
    category: string[],
    level: string[]
  ): Promise<Paginatedcourses> {
    try {
      const skip = (page - 1) * limit;

      let filter: any = { isListed: true, isPublished: true };

      if (search) {
        filter.$or = [
          { courseName: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      if (category && category.length > 0) {
        filter.category = { $in: category };
      }

      if (level && level.length > 0) {
        filter.level = { $in: level };
      }

      let sortOption: any = {};
      switch (sort) {
        case "price-low":
          sortOption = { price: 1 };
          break;
        case "price-high":
          sortOption = { price: -1 };
          break;
        case "rating":
          sortOption = { rating: -1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "popular":
        default:
          sortOption = { studentsEnrolled: -1 };
          break;
      }

      const courses = await CourseModel.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec();

      const totalCourses = await CourseModel.countDocuments(filter);

      return {
        courses,
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses,
      };
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
    txnid: string,
    price: Number
  ): Promise<IPurchasedCourse | null> {
    try {
      const courseDetails = await this.findById(courseId);
      if (!courseDetails) throw new Error(CourseErrorMessages.COURSE_NOT_FOUND);

      const boughtCourse = await PurchasedCourseModel.findOneAndUpdate(
        { userId, courseId },
        {
          instructorId: courseDetails.mentorId,
          transactionId: txnid,
          completedChapters,
          quizId,
          isCourseCompleted: false,
          price,
        },
        { upsert: true, new: true }
      );

      return boughtCourse;
    } catch (error) {
      throw error;
    }
  }

  async getBoughtCourses(
    userId: string,
    page: number,
    limit: number
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const response = await PurchasedCourseModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("courseId", "courseId courseName level thumbnailUrl quizId _id")
        .exec();
      console.log(response, "response");
      const totalCourses = await PurchasedCourseModel.countDocuments({
        userId,
      });

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

      if (chapterIndex === -1) throw new Error(CourseErrorMessages.CHAPTERS_NOT_FOUND);

      findChapter.completedChapters[chapterIndex].isCompleted = true;
      const updatedChapters = await findChapter.save();

      return updatedChapters;
    } catch (error) {
      throw error;
    }
  }

  async getBoughtCourseById(
    courseId: string
  ): Promise<IPurchasedCourse | null> {
    try {
      if (!courseId) throw new Error(CourseErrorMessages.COURSE_ID_NOT_FOUND);
      const course = await PurchasedCourseModel.findById(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourseById(courseId: string): Promise<ICourse | null> {
    try {
      if (!courseId) throw new Error(CourseErrorMessages.COURSE_ID_NOT_FOUND);
      const course = await CourseModel.findById(courseId);
      if (course?.quizId) {
        await QuizModel.findOneAndDelete({ courseId: course._id });
      }
      await ChapterModel.deleteMany({ courseId });
      const deletedCourse = await this.delete(courseId);
      return deletedCourse;
    } catch (error) {
      throw error;
    }
  }
}
