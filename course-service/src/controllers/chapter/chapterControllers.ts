import { NextFunction, Request, Response } from "express";
import { IChapterControllers } from "../chapter/IChapterControllers";
import { IChapterService } from "../../services/chapter/IChapterService";
import produce from "../../config/kafka/producer";
import getId from "../../utils/getId";
import { CourseModel } from "../../models/courseModel";

import mongoose, { Mongoose , Types } from "mongoose";


export class ChapterContoller implements IChapterControllers {
  private chapterService: IChapterService;

  constructor(chapterService: IChapterService) {
    this.chapterService = chapterService;
  }

  public async addChapter(req: Request, res: Response): Promise<any> {
    try {

        const { courseId } = req.params; // Extract courseId from the query
        const { title, description } = req.body;
        console.log(title,description ,courseId)

        // Validate courseId
        if (!courseId) {
            return res.status(400).send({
                message: 'Course ID is required',
                success: false,
            });
        }
        if (!title && ! !description) {
            return res.status(400).send({
                message: 'Course ID is required',
                success: false,
            });
        }

        // Validate the file
        const file = req.file as any;
        if (!file || !file.location) {
            return res.status(400).send({
                message: 'Chapter video file is required',
                success: false,
            });
        }
        console.log(file)
         let Id=new Types.ObjectId(courseId) 
        // Create a new chapter
        const newChapter = await this.chapterService.createChapter({
            chapterTitle: title,
            courseId:Id,
            description,
            videoUrl: file.location,
        });

        // Update the course to include this chapter's ID in the fullVideo array
        await CourseModel.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    fullVideo: { chapterId: newChapter._id },
                },
            },
            { new: true } // Return the updated document
        );

        // Respond with success
        return res.status(201).send({
            message: 'Chapter added successfully',
            success: true,
            chapter: newChapter,
        });
    } catch (error: any) {
        return res.status(500).send({
            message: 'An error occurred while adding the chapter',
            success: false,
            error: error.message,
        });
    }
}


public async updateChapter(req: Request, res: Response): Promise<any> {
    try {

        const { chapterId } = req.params;
        const { title, description ,courseId } = req.body;

        console.log(req.body,"reqbody")

        // Validate chapterId
        if (!chapterId) {
            return res.status(400).send({
                message: "Chapter ID is required",
                success: false,
            });
        }

        // Validate title and description
        if (!title || !description) {
            return res.status(400).send({
                message: "Title and description are required",
                success: false,
            });
        }

        console.log("ffffffileeeee")
        // Handle file if provided
        const file = req.file as any;
        const fileLocation = file?.location
        console.log(file,fileLocation,"fileeeee")

        // Call the service to edit the chapter
        const response = await this.chapterService.updateChapter(String(chapterId),
            {chapterTitle:title,
            description,
            courseId,
            
            videoUrl:fileLocation}
        );

        // Check for a valid response
        if (!response) {
            return res.status(404).send({
                message: "Chapter not found or could not be updated",
                success: false,
            });
        }

        return res.status(200).send({
            message: "Chapter updated successfully",
            success: true,
            data: response,
        });

    } catch (error: any) {
        return res.status(500).send({
            message: 'Internal Server Error',
            success: false,
        });
    }
}
  // Fetch all chapters
  async getAllChapters(req: Request, res: Response,next:NextFunction): Promise<any> {
    try {
        const { courseId } = req.params
        const response = await this.chapterService.getAllChapters(String(courseId))
        return res
            .status(200)
            .send({
                message: 'chapters fetched!',
                success: true,
                data: response
            })
    } catch (error: any) {
        return res.status(500).send({
            message: 'Internal Server Error',
            success: false,
        });
    }
}

  // Fetch a single chapter by ID
  async getChapterById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const chapter = await this.chapterService.getChapterById(id);
      console.log(chapter,id)
      if (!chapter) {
        res.status(404).json({ message: "Chapter not found" });
        return;
      }
      res.status(200).json(chapter);
    } catch (error) {
      next(error);
    }
  }



}
