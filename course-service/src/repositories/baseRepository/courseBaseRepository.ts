import { updateRequestType } from "@/Types/updateRequestType";
import { ICourseBaseRepository } from "./ICourseBaseRepository";
import { CourseModel, ICourse } from "../../models/courseModel";
import { ChapterModel, IChapter } from "../../models/chapterModel";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchasedModel";
import getId from "@/utils/getId";
import mongoose from "mongoose";

export class CourseBaseRepository implements ICourseBaseRepository{

    async createCourse(courseData: ICourse): Promise<ICourse> {
        const course = new CourseModel(courseData);
        return await course.save();
      }
     async updateCourseByCourseId(courseId:string,courseData:ICourse):Promise<ICourse | null>{
      const course= await CourseModel.findByIdAndUpdate(courseId,courseData,{new:true})
      return course
     }
    

      async getAllCourses(): Promise<ICourse[]> {
        return await CourseModel.find();
      }
    
      async getCourseById(id: string): Promise<ICourse | null> {
        return await CourseModel.findById(id);
      }
      async getInstructorCourses(instructorId: string): Promise<ICourse[]> {
        try {
          const response=await CourseModel.find({mentorId:instructorId})
          return response
          
        } catch (error) {
          throw error
        }
      }
      async getChapterById(id: string): Promise<IChapter[] | null> {
        return await ChapterModel.find({courseId:id});
      }
      async buyCourse(userId: string,quizId:string, courseId: string, completedChapters: any, txnid: string):Promise<IPurchasedCourse | null>{
        try {
          console.log("==",userId,courseId,completedChapters,txnid)

          const courseDetails = await CourseModel.findById(courseId);
          const userObjectId = new mongoose.Types.ObjectId(userId);
          const courseObjectId = new mongoose.Types.ObjectId(courseId);

          const boughtCourse = await PurchasedCourseModel.findOneAndUpdate(
            { userId, courseId },
            // { userObjectId, courseObjectId },
            {
              instructorId: courseDetails?.mentorId,
              transactionId: txnid,
              completedChapters,
              quizId,
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

            const response = await PurchasedCourseModel
                .find({ userId: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("courseId", "courseName level thumbnailUrl quizId")

                .exec();

                console.log(response)

            const totalCourses = await PurchasedCourseModel.countDocuments({ userId: userId });


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
    public async chapterVideoEnd(chapterId: string): Promise<any> {
      try {

          const findChapter = await PurchasedCourseModel.findOne({
              "completedChapters.chapterId": chapterId
          }) as unknown as IPurchasedCourse

          if (!findChapter) {
              return 'Purchased Course not Found'
          }

          const chapterIndex = findChapter.completedChapters.findIndex((chapter) => chapter.chapterId.toString() === chapterId);

          if (chapterIndex === -1) {
              return `Chapter Not Found`
          }

          findChapter.completedChapters[chapterIndex].isCompleted = true

          const updatedChapters = await findChapter.save()

          return updatedChapters

      } catch (error: any) {
          throw error
      }
  }



    }


   
