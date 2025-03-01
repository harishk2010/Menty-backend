// import { Request, Response } from "express"

// export interface IChatController{
//     createChat(req: Request, res: Response):Promise<void>
//     getChat(req: Request, res: Response):Promise<void>
//     getChatHistory(req: Request, res: Response):Promise<void>
// }
// controller/IChatController.ts
import { IBooking } from '../models/bookingModel';
import { Request, Response } from 'express';

export interface IChatController {
  createChat(req: Request, res: Response): Promise<void>;
  getChat(req: Request, res: Response): Promise<void>;
  getChatHistory(req: Request, res: Response): Promise<void>;
  uploadChatImage(req: Request, res: Response): Promise<void>;
  addBooking(data:IBooking): Promise<void>
}