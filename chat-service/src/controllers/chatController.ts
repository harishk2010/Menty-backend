import { Request, Response } from 'express';
import { IChatController } from './IChatController';
import { IChatService } from '../services/IChatService';

export class ChatController implements IChatController {
  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  async createChat(req: Request, res: Response):Promise<void>{
    try {
      const { bookingId, studentId, instructorId } = req.body;
      console.log(req.body,"createChat")
      const chat = await this.chatService.createChat(bookingId, studentId, instructorId);
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chat' });
      throw error
    }
  };

  async getChat (req: Request, res: Response):Promise<void>{
    try {
      const { bookingId } = req.params;
      const chat = await this.chatService.getChat(bookingId);
      
      if (!chat) {
         res.status(404).json({ error: 'Chat not found' });
         return
        }
      
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat' });
      throw error
    }
  };

  async getChatHistory (req: Request, res: Response):Promise<void>{
    try {
      const { bookingId } = req.params;
      console.log(bookingId,"bookingId")
      const messages = await this.chatService.getChatHistory(bookingId);
      console.log(messages,"messages")
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat history' });
      throw error
    }
  };
}