import { Request, Response } from "express";
import { IChatController } from "./interfaces/IChatController";
import { IChatService } from "../services/interfaces/IChatService";
import upload from "../utils/multer";
import { BookingModel, IBooking } from "../models/bookingModel";
import { generateSignedUrl } from "../utils/signedUrlGenerator";
import { StatusCode } from "../utils/enums";
import { ChatErrorMessages, ChatSuccessMessages, GeneralServerErrorMsg } from "../utils/constants";

export class ChatController implements IChatController {
  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  async createChat(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, studentId, instructorId } = req.body;
      
      const chat = await this.chatService.createChat(
        bookingId,
        studentId,
        instructorId
      );
      res.status(StatusCode.OK).json(chat);
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR });
      throw error;
    }
  }

  async getChat(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const chat = await this.chatService.getChat(bookingId);

      if (!chat) {
        res.status(StatusCode.NOT_FOUND).json({ error: ChatErrorMessages.CHAT_NOT_FOUND });
        return;
      }

      res.status(StatusCode.OK).json(chat);
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: ChatErrorMessages.CHAT_FETCH_FAILED });
      throw error;
    }
  }

  async getChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const messages = await this.chatService.getChatHistory(bookingId);

      const signedImageMessage = await Promise.all(

        messages.map(async (message) => {
          if (message.imageUrl) {
            const messageObj = message.toObject();
            const signedImageUrl = await generateSignedUrl(message?.imageUrl);
            return {
              ...messageObj,
              imageUrl: signedImageUrl,
            };
          } else return message;

        })
      );

      res.status(StatusCode.OK).json(signedImageMessage);
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: ChatErrorMessages.CHAT_HISTORY_FETCH_FAILED });
      throw error;
    }
  }

  async uploadChatImage(req: Request, res: Response): Promise<void> {
    const uploadSingle = upload.single("chat");

    uploadSingle(req, res, async (err: any) => {

      if (err) {
        console.error(ChatErrorMessages.IMAGE_UPLOAD_FAILED, err);
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ error: ChatErrorMessages.IMAGE_UPLOAD_FAILED, details: err.message });
        return;
      }

      try {
        const file = req.file as Express.Multer.File & { key: string };
        if (!file) {
          res.status(StatusCode.BAD_REQUEST).json({ error: ChatErrorMessages.FILE_NOT_UPLOADED });
          return;
        }

        res.status(StatusCode.OK).json({
          imageUrl: file.key,
          message: ChatSuccessMessages.IMAGE_UPLOADED,
        });
      } catch (error) {
        console.error(ChatErrorMessages.IMAGE_PROCESSING_FAILED, error);
        res.status(500).json({ error: ChatErrorMessages.IMAGE_PROCESSING_FAILED });
      }
    });
  }
  async addBooking(data: IBooking): Promise<void> {
    try {
      await BookingModel.create(data);

    } catch (error) {
      console.error(ChatErrorMessages.CREATE_BOOKING_FAILED, error);
    }
  }
}
