import { NextFunction, Request, Response } from "express";
import { IChapterControllers } from "../interfaces/IChapterControllers";
import { IChapterService } from "../../services/interfaces/IChapterService";
import { CourseModel } from "../../models/courseModel";
import { Types } from "mongoose";
import { generateSignedUrl } from "../../utils/signedUrlGenerator";
import getId from "../../utils/getId";
import { ChapterErrorMessages, ChapterSuccessMessages } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";

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
        res.status(StatusCode.BAD_REQUEST).json({ message: ChapterErrorMessages.MISSING_REQUIRED_FIELDS });
        return;
      }

      if (!files?.chapterVideo) {
        res.status(StatusCode.BAD_REQUEST).json({ message: ChapterErrorMessages.MISSING_VIDEO_FILE });
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
        .status(StatusCode.CREATED)
        .json({
          success: true,
          message: ChapterSuccessMessages.CHAPTER_ADDED,
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
          .status(StatusCode.BAD_REQUEST)
          .json({ message: ChapterErrorMessages.MISSING_REQUIRED_FIELDS, success: false });
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
        res.status(StatusCode.NOT_FOUND).json({ message: ChapterErrorMessages.CHAPTER_NOT_FOUND, success: false });
        return;
      }

      res
        .status(StatusCode.OK)
        .json({
          message: ChapterSuccessMessages.CHAPTER_UPDATED,
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
          .status(StatusCode.BAD_REQUEST)
          .json({ message: ChapterErrorMessages.COURSE_ID_REQUIRED, success: false });
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
        .status(StatusCode.OK)
        .json({
          message: ChapterSuccessMessages.CHAPTERS_FETCHED,
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
          .status(StatusCode.BAD_REQUEST)
          .json({ message: ChapterErrorMessages.CHAPTER_ID_REQUIRED, success: false });
        return;
      }

      const chapter = await this.chapterService.getChapterById(id);

      if (!chapter) {
        res.status(StatusCode.NOT_FOUND).json({ message: ChapterErrorMessages.CHAPTER_NOT_FOUND, success: false });
        return;
      }

      res
        .status(StatusCode.OK)
        .json({
          message: ChapterSuccessMessages.CHAPTER_FETCHED,
          success: true,
          data: chapter,
        });
    } catch (error) {
      next(error);
    }
  }
}
