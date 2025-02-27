import { NextFunction, Request, Response } from "express";
import { IChapterControllers } from "../chapter/IChapterControllers";
import { IChapterService } from "../../services/chapter/IChapterService";
import { CourseModel } from "../../models/courseModel";
import { Types } from "mongoose";
import { generateSignedUrl } from "../../utils/signedUrlGenerator";

export class ChapterController implements IChapterControllers {
  constructor(private chapterService: IChapterService) {}

  async addChapter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const { title, description } = req.body;
      
      // const file = req.file as Express.Multer.File & { location: string };
      // console.log(file, "file");
    
      // if (!courseId || !title || !description ) {
      //   res.status(400).json({ message: "Missing required fields", success: false });
      //   return;
      // }
      // if (!file?.key) {
      //   res.status(400).json({ message: "Missing required file", success: false });
      //   return;
      // }
      // // if (!file?.location) {
      // //   res.status(400).json({ message: "Missing required file", success: false });
      // //   return;
      // // }
    
      // const newChapter = await this.chapterService.createChapter({
      //   chapterTitle: title,
      //   courseId: new Types.ObjectId(courseId),
      //   description,
      //   // videoUrl: file.location, 
      //   videoUrl: file.key, 
      // });
    
      // await CourseModel.findByIdAndUpdate(
      //   courseId,
      //   { $push: { fullVideo: { chapterId: newChapter._id } } },
      //   { new: true }
      // );
    
      // res.status(201).json({ message: "Chapter added successfully", success: true, data: newChapter });
      const file = req.file as Express.Multer.File & { key: string };

      console.log(file, "file");
  
      if (!courseId || !title || !description) {
        res.status(400).json({ message: "Missing required fields", success: false });
        return;
      }
  
      if (!file?.key) {
        res.status(400).json({ message: "Missing required file", success: false });
        return;
      }
  
      // ✅ Store only the S3 key (not the full URL)
      const newChapter = await this.chapterService.createChapter({
        chapterTitle: title,
        courseId: new Types.ObjectId(courseId),
        description,
        videoUrl: file.key, // Store only the S3 object key
      });
  
      // ✅ Add the chapter to the course
      await CourseModel.findByIdAndUpdate(
        courseId,
        { $push: { fullVideo: { chapterId: newChapter._id } } },
        { new: true }
      );
  
      res.status(201).json({ 
        message: "Chapter added successfully", 
        success: true, 
        data: newChapter 
      });
    } catch (error) {
      next(error);
    }
    
  }

  async updateChapter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chapterId } = req.params;
      const { title, description ,courseId } = req.body;
      const file = req.file as Express.Multer.File  & { location: string };

      if (!chapterId || !title || !description) {
        res.status(400).json({ message: "Missing required fields", success: false });
        return;
      }
      if ( !file?.location) {
        res.status(400).json({ message: "Missing required file", success: false });
        return;
      }

      const updateData = {
        courseId ,
        chapterTitle: title,
        description,
        videoUrl: file?.location,
      };

      const updatedChapter = await this.chapterService.updateChapter(chapterId, updateData);

      if (!updatedChapter) {
        res.status(404).json({ message: "Chapter not found", success: false });
        return;
      }

      res.status(200).json({ message: "Chapter updated successfully", success: true, data: updatedChapter });
    } catch (error) {
      next(error);
    }
  }

  async getAllChapters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        res.status(400).json({ message: "Course ID is required", success: false });
        return;
      }

      const chapters = await this.chapterService.getAllChapters(courseId);

      const signedChapters= await Promise.all(chapters.map(async(chapter)=>{
        const chapterObj = chapter.toObject();
        const signedUrl=await generateSignedUrl(chapterObj.videoUrl)
        return {
          ...chapterObj,videoUrl:signedUrl
        }
      }))
      console.log(signedChapters)
      
      res.status(200).json({ message: "Chapters fetched successfully", success: true, data: signedChapters });
    } catch (error) {
      next(error);
    }
  }

  async getChapterById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Chapter ID is required", success: false });
        return;
      }

      const chapter = await this.chapterService.getChapterById(id);

      if (!chapter) {
        res.status(404).json({ message: "Chapter not found", success: false });
        return;
      }

      res.status(200).json({ message: "Chapter fetched successfully", success: true, data: chapter });
    } catch (error) {
      next(error);
    }
  }
}