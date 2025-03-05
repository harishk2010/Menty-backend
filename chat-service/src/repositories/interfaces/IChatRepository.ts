import { IChat, IMessage } from "../../models/chatModel";
import { IGenericRepository } from "../GenericRepository";

export interface IChatRepository extends IGenericRepository<IChat> {
    findByBookingId(bookingId: string): Promise<IChat | null>;
    // createChat(data: {bookingId: string,studentId:string,instructorId:String, messages: IMessage[]}): Promise<IChat | null>
    addMessage(chatId: string, message: IMessage): Promise<IChat | null>;
    getMessages(chatId: string): Promise<IMessage[]>;
  }