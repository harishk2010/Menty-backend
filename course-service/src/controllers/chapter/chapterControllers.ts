import { NextFunction, Request, Response } from "express";
import { IChapterControllers } from "../interfaces/IChapterControllers";
import { IChapterService } from "../../services/interfaces/IChapterService";
import { CourseModel } from "../../models/courseModel";
import { Types } from "mongoose";
import { generateSignedUrl } from "../../utils/signedUrlGenerator";
import getId from "../../utils/getId";

export class ChapterController implements IChapterControllers {
  constructor(private chapterService: IChapterService) {}

  async addChapter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const chapterData = req.body;
      const { title, description } = req.body;

      const mentorId = await getId("accessToken", req);
      chapterData.mentorId = mentorId;

      const files = req.files as {
        chapterVideo?: Express.MulterS3.File[];
        captionsFile?: Express.MulterS3.File[];
      };
      if (!courseId || !chapterData.title || !chapterData.description) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      if (!files?.chapterVideo) {
        res.status(400).json({ message: "Missing required video file" });
        return;
      }

      const videoUrl = files.chapterVideo[0].key;
      const captionsUrl = files.captionsFile?.[0]?.key;

      const newChapter = await this.chapterService.createChapter({
        chapterTitle: title,
        description,
        courseId: new Types.ObjectId(courseId),
        videoUrl,
        captionsUrl,
      });

      await CourseModel.findByIdAndUpdate(
        courseId,
        { $push: { fullVideo: { chapterId: newChapter._id } } },
        { new: true }
      );

      res
        .status(201)
        .json({
          success: true,
          message: "Chapter added successfully",
          data: newChapter,
        });
    } catch (error) {
      next(error);
    }
  }

  async updateChapter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { chapterId } = req.params;
      const { title, description, courseId } = req.body;

      const files = req.files as {
        chapterVideo?: Express.MulterS3.File[];
        captionsFile?: Express.MulterS3.File[];
      };

      if (!chapterId || !title || !description) {
        res
          .status(400)
          .json({ message: "Missing required fields", success: false });
        return;
      }

      const updateData: any = {
        courseId,
        chapterTitle: title,
        description,
      };

      if (files?.chapterVideo?.[0]) {
        updateData.videoUrl = files.chapterVideo[0].key;
      }

      if (files?.captionsFile?.[0]) {
        updateData.captionsUrl = files.captionsFile[0].key;
      }

      const updatedChapter = await this.chapterService.updateChapter(
        chapterId,
        updateData
      );

      if (!updatedChapter) {
        res.status(404).json({ message: "Chapter not found", success: false });
        return;
      }

      res
        .status(200)
        .json({
          message: "Chapter updated successfully",
          success: true,
          data: updatedChapter,
        });
    } catch (error) {
      next(error);
    }
  }

  async getAllChapters(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        res
          .status(400)
          .json({ message: "Course ID is required", success: false });
        return;
      }

      const chapters = await this.chapterService.getAllChapters(courseId);

      const signedChapters = await Promise.all(
        chapters.map(async (chapter) => {
          const chapterObj = chapter.toObject();
          const signedUrl = await generateSignedUrl(chapterObj.videoUrl);
          return {
            ...chapterObj,
            videoUrl: signedUrl,
          };
        })
      );

      res
        .status(200)
        .json({
          message: "Chapters fetched successfully",
          success: true,
          data: signedChapters,
        });
    } catch (error) {
      next(error);
    }
  }

  async getChapterById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json({ message: "Chapter ID is required", success: false });
        return;
      }

      const chapter = await this.chapterService.getChapterById(id);

      if (!chapter) {
        res.status(404).json({ message: "Chapter not found", success: false });
        return;
      }

      res
        .status(200)
        .json({
          message: "Chapter fetched successfully",
          success: true,
          data: chapter,
        });
    } catch (error) {
      next(error);
    }
  }
}
