import { updateRequestType } from "@/Types/updateRequestType";
import { IChapterBaseRepository } from "./IChapterBaseRepository";
import { ChapterModel, IChapter } from "../../../models/chapterModel";
import { CourseModel } from "../../../models/courseModel";

export class ChapterBaseRepository implements IChapterBaseRepository {
  async createChapter(chapterData: IChapter): Promise<IChapter> {
    const chapter = new ChapterModel(chapterData);
    return await chapter.save();
  }
  async updateChapterByChapterId(
    chapterId: string,
    chapterData: IChapter
  ): Promise<IChapter | null> {
    try {
      console.log("aaaaaaaaaaaaaaaupdatechapter")
      const updatedChapter = await ChapterModel.findByIdAndUpdate(
        chapterId,
        chapterData,
        { new: true }
      );
      console.log(updatedChapter,"updatechapter")
      if (!updatedChapter) {
        throw new Error("Chapter not found");
      }

      const updatedCourse = await CourseModel.updateOne(
        { "fullVideo.chapterId": chapterId },
        { $set: { "fullVideo.$[elem].chapterId": updatedChapter._id } },
        { arrayFilters: [{ "elem.chapterId": chapterId }] }
      );

      if (!updatedCourse || updatedCourse.modifiedCount === 0) {
        console.warn("No course updated for the given chapterId");
      }
      return updatedChapter;
    } catch (error) {
      throw error;
    }
  }

  // Get all chapters
  async getAllChapters(courseId: string): Promise<IChapter[]> {
    return await ChapterModel.find({ courseId });
  }

  // Get a single chapter by ID
  async getChapterById(id: string): Promise<IChapter | null> {
    return await ChapterModel.findById(id);
  }
}
