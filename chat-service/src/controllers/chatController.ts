// import { Request, Response } from 'express';
// import { IChatController } from './IChatController';
// import { IChatService } from '../services/IChatService';

// export class ChatController implements IChatController {
//   private chatService: IChatService;

//   constructor(chatService: IChatService) {
//     this.chatService = chatService;
//   }

//   async createChat(req: Request, res: Response):Promise<void>{
//     try {
//       const { bookingId, studentId, instructorId } = req.body;
//       console.log(req.body,"createChat")
//       const chat = await this.chatService.createChat(bookingId, studentId, instructorId);
//       res.status(201).json(chat);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create chat' });
//       throw error
//     }
//   };

//   async getChat (req: Request, res: Response):Promise<void>{
//     try {
//       const { bookingId } = req.params;
//       const chat = await this.chatService.getChat(bookingId);
      
//       if (!chat) {
//          res.status(404).json({ error: 'Chat not found' });
//          return
//         }
      
//       res.status(200).json(chat);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch chat' });
//       throw error
//     }
//   };

//   async getChatHistory (req: Request, res: Response):Promise<void>{
//     try {
//       const { bookingId } = req.params;
//       console.log(bookingId,"bookingId")
//       const messages = await this.chatService.getChatHistory(bookingId);
//       console.log(messages,"messages")
//       res.status(200).json(messages);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch chat history' });
//       throw error
//     }
//   };
// }
// controller/chatController.ts
import { Request, Response } from 'express';
import { IChatController } from './interfaces/IChatController';
import { IChatService } from '../services/interfaces/IChatService';
import upload from '../utils/multer';
import { BookingModel, IBooking } from '../models/bookingModel';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { generateSignedUrl } from '../utils/signedUrlGenerator';

export class ChatController implements IChatController {
  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  async createChat(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, studentId, instructorId } = req.body;
      console.log(req.body, "createChat");
      const chat = await this.chatService.createChat(bookingId, studentId, instructorId);
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chat' });
      throw error;
    }
  }

  async getChat(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      console.log(bookingId,"bookingId-----------------------------------------------------------------")
      const chat = await this.chatService.getChat(bookingId);
      
      if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }
      
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat' });
      throw error;
    } 
  }

  async getChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      console.log(bookingId, "bookingId");
      const messages = await this.chatService.getChatHistory(bookingId);
      const signedImageMessage=await Promise.all(messages.map(async(message)=>{
        if(message.imageUrl){

          const messageObj= message.toObject()
          const signedImageUrl=await generateSignedUrl(message?.imageUrl)
          return{
            ...messageObj,imageUrl:signedImageUrl
          }
        }else return message
      }))

      console.log(messages, "messages");
      console.log(signedImageMessage, "messages");
      res.status(200).json(signedImageMessage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat history' });
      throw error;
    }
  }

  async uploadChatImage(req: Request, res: Response): Promise<void> {
    const uploadSingle = upload.single('chat');
    // console.log("chat-image",uploadSingle)
    
    uploadSingle(req, res, async (err: any) => {
      if (err) {
        console.error('Upload error:', err);
        res.status(400).json({ error: 'Image upload failed', details: err.message });
        return;
      }
      console.log("chat-image222")

      try {
        // @ts-ignore - multer-s3 adds this property
        const file = req.file as Express.Multer.File & { key: string };;
        if (!file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }

        // Return the S3 image URL
        res.status(200).json({ 
          imageUrl: file.key,
          message: 'Image uploaded successfully' 
        });
      } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({ error: 'Image processing failed' });
      }
    });

    
  }
  async addBooking(data: IBooking): Promise<void> {
    try {
      const booking=await BookingModel.create(data)
      console.log(booking,"created booking in chat")
      
    } catch (error) {
      console.error('Image processing error:', error);
       
    }
  }
}