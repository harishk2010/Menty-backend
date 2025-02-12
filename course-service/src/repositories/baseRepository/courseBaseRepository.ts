import { updateRequestType } from "@/Types/updateRequestType";
import { ICourseBaseRepository } from "./ICourseBaseRepository";
import { CourseModel, ICourse } from "../../models/courseModel";
import { ChapterModel, IChapter } from "../../models/chapterModel";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchasedModel";
import getId from "@/utils/getId";

export class CourseBaseRepository implements ICourseBaseRepository{

    async createCourse(courseData: ICourse): Promise<ICourse> {
        const course = new CourseModel(courseData);
        return await course.save();
      }
     async updateCourseByCourseId(courseId:string,courseData:ICourse):Promise<ICourse | null>{
      const course= await CourseModel.findByIdAndUpdate(courseId,courseData,{new:true})
      return course
     }
    
      // Get all courses
      async getAllCourses(): Promise<ICourse[]> {
        return await CourseModel.find();
      }
    
      // Get a single course by ID
      async getCourseById(id: string): Promise<ICourse | null> {
        return await CourseModel.findById(id);
      }
      async getChapterById(id: string): Promise<IChapter[] | null> {
        return await ChapterModel.find({courseId:id});
      }
      async buyCourse(userId: string, courseId: string, completedChapters: any, txnid: string):Promise<IPurchasedCourse | null>{
        try {
          

         
      
          // const savedUser = await boughtCourse.save()
          const courseDetails = await CourseModel.findById(courseId);

          const boughtCourse = await PurchasedCourseModel.findOneAndUpdate(
            { userId, courseId },
            {
              instructorId: courseDetails?.mentorId,
              transactionId: txnid,
              completedChapters,
              isCourseCompleted: false,
            },{
              upsert:true,
              new:true
            }
          );
          // return savedUser
          return boughtCourse

      } catch (error: any) {
        console.log(error)
          throw error
      }
      }

      public async getBoughtCourses(userId: string, page: number = 1, limit: number = 4): Promise<any> {
        try {

            const skip = (page - 1) * limit;

            // Fetch the courses with pagination and populate course details
            const response = await PurchasedCourseModel
                .find({ userId: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("courseId", "courseName level thumbnailUrl")
                // .populate("instructorId",'username')
                .exec();

                console.log(response)
            // Count the total number of courses for the user
            const totalCourses = await PurchasedCourseModel.countDocuments({ userId: userId });

           

            // Return the paginated data
            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses,
            };
        } catch (error: any) {
            throw error
        }
    }



    }


   
