import { IChat, IMessage } from "../models/chatModel";


export interface IChatService {
    createChat(bookingId: string, studentId: string, instructorId: string): Promise<IChat>;
    getChat(bookingId: string): Promise<IChat | null>;
    addMessage(bookingId: string, message: Partial<IMessage>): Promise<IChat | null>;
    getChatHistory(bookingId: string): Promise<IMessage[]>;
  }