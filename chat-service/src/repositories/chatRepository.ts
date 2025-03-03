import { GenericRepository } from '../repositories/GenericRepository';
import { Chat, IChat, IMessage } from '../models/chatModel';
import { IChatRepository } from '../interfaces/IChatRepository';
import { UpdateQuery } from 'mongoose';

export class ChatRepository extends GenericRepository<IChat> implements IChatRepository {
  constructor() {
    super(Chat);
  }

  async findByBookingId(bookingId: string): Promise<IChat | null> {
    // console.log(bookingId,"booking id in repo")

    return await this.findOne({ bookingId });
  }

  // async createChat(data: {bookingId: string,studendId:string,instructorId:string, messages: IMessage[]}): Promise<IChat | null> {
  //   return await this.create(data);
  // }

  async addMessage(chatId: string, message: IMessage): Promise<IChat | null> {
    return await this.updateOne(
      { _id: chatId },
      { 
        $push: { messages: message }
      }as UpdateQuery<IChat> 
    );
  }

  async getMessages(chatId: string): Promise<IMessage[]> {
    const chat = await this.findById(chatId);
    return chat?.messages || [];
  }
}
