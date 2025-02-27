import { ICourse } from "../../models/courseModel";
import { GenericRepository } from "../GenericRepository";
import {CourseModel} from "../../models/courseModel";
import { ICourseRepository } from "./ICourseRepository";
import { ChapterModel, IChapter } from "../../models/chapterModel";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchasedModel";
import { QuizModel } from "../../models/quizModel";
import { Paginatedcourses } from "../../Types/updateRequestType";

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
  async getInstructorCoursesList(
    instructorId: string, 
    page: number, 
    limit: number,
    search: string = '',
    sortField: string = 'lastUpdated',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ courses: ICourse[]; total: number } | null> {
    try {
      // Create base query for instructor's courses
      let query: any = { mentorId: instructorId };
      
      // Add search functionality across relevant fields
      if (search) {
        // Create a regex search pattern that's case insensitive
        const searchRegex = new RegExp(search, 'i');
        
        query = {
          $and: [
            { mentorId: instructorId },
            {
              $or: [
                { courseName: searchRegex },
                { category: searchRegex },
                { level: searchRegex },
                { description: searchRegex }
                // Add other searchable fields as needed
              ]
            }
          ]
        };
        
        // If search is numeric, also search price
        if (!isNaN(Number(search))) {
          query.$and[1].$or.push({ price: Number(search) });
        }
      }
      
      // Get total count for pagination
      const total = await CourseModel.countDocuments(query);
      
      // Create sort object
      const sort: any = {};
      sort[sortField] = sortOrder === 'asc' ? 1 : -1;
      
      // Apply pagination and sorting
      const skip = (page - 1) * limit;
      
      const courses = await CourseModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        console.log(courses,"soursesss")
        
      
      return {
        courses,
        total
      };
    } catch (error) {
      console.error("Error in getInstructorCoursesList repository:", error);
      throw error;
    }
  }
  async getPaginatedCourses(page: number, limit: number, search: string, sort: string, category: string[], level: string[]): Promise<Paginatedcourses> {
    try {
      const skip = (page - 1) * limit;
      
      // Build filter object
      let filter: any = { isListed: true, isPublished: true };
      
      // Add search functionality
      if (search) {
        filter.$or = [
          { courseName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      // Add category filter
      if (category && category.length > 0) {
        filter.category = { $in: category };
      }
      
      // Add level filter
      if (level && level.length > 0) {
        filter.level = { $in: level };
      }
      
      // Determine sort order
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
      
      // Execute query with pagination and sorting
      const courses = await CourseModel.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec();
      
      // Get total count for pagination
      const totalCourses = await CourseModel.countDocuments(filter);
      
      return {
        courses,
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses
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

  async getBoughtCourseById(courseId: string): Promise<IPurchasedCourse | null> {
    try {
      if (!courseId) throw new Error("Purchased courseId not Found");
      const course=await PurchasedCourseModel.findById(courseId)
      return course
      
    } catch (error) {
      throw error
    }
  }
  
  async deleteCourseById(courseId: string): Promise<ICourse | null> {
    try {
      
      if (!courseId) throw new Error("Purchased courseId not Found");
      const course=await CourseModel.findById(courseId)
      if(course?.quizId){
        await QuizModel.findOneAndDelete({courseId:course._id})
      }
      await ChapterModel.deleteMany({courseId})
      const deletedCourse=await this.delete(courseId)
      return deletedCourse
      
    } catch (error) {
      throw error
      
    }
    
  }
}