// import { IChatService } from '../services/IChatService';
// import { IChat, IMessage } from '../models/chatModel';
// import { IChatRepository } from '../repositories/IChatRepository';

// export class ChatService implements IChatService {
//   private chatRepository: IChatRepository;

//   constructor(chatRepository: IChatRepository) {
//     this.chatRepository = chatRepository
//   }

//   async createChat(bookingId: string, studentId: string, instructorId: string): Promise<IChat> {
//     const existingChat = await this.chatRepository.findByBookingId(bookingId);
//     if (existingChat) {
//       return existingChat;
//     }

//     return await this.chatRepository.create({
//       bookingId,
//       studentId,
//       instructorId,
//       messages: []
//     });
//   }

//   async getChat(bookingId: string): Promise<IChat | null> {
//     return await this.chatRepository.findByBookingId(bookingId);
//   }

//   async addMessage(bookingId: string, messageData: Partial<IMessage>): Promise<IChat | null> {
//     const chat = await this.chatRepository.findByBookingId(bookingId);
//     if (!chat) {
//       throw new Error('Chat not found');
//     }

//     return await this.chatRepository.addMessage(String(chat._id), messageData as IMessage);
//   }

//   async getChatHistory(bookingId: string): Promise<IMessage[]> {
//     try {
//       // console.log(bookingId,"booking id in service")
      
//       const chat = await this.chatRepository.findByBookingId(bookingId);
//       if (!chat) {
//         return [];
//       }
//       return chat.messages;
//     } catch (error) {
//       console.log(error)
//       throw error
      
//     }
//   }
// }
// services/chatService.ts
import { IChatService } from '../services/IChatService';
import { IChat, IMessage } from '../models/chatModel';
import { IChatRepository } from '../repositories/IChatRepository';

export class ChatService implements IChatService {
  private chatRepository: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat(bookingId: string, studentId: string, instructorId: string): Promise<IChat> {
    const existingChat = await this.chatRepository.findByBookingId(bookingId);
    if (existingChat) {
      return existingChat;
    }

    return await this.chatRepository.create({
      bookingId,
      studentId,
      instructorId,
      messages: []
    });
  }

  async getChat(bookingId: string): Promise<IChat | null> {
    return await this.chatRepository.findByBookingId(bookingId);
  }

  async addMessage(bookingId: string, messageData: Partial<IMessage>,chatData: { studentId: string, instructorId: string }): Promise<IChat | null> {
    let chat = await this.chatRepository.findByBookingId(bookingId);
    
    // If not, create a new chat
    if (!chat) {
      chat = await this.chatRepository.create({
        bookingId,
        studentId: chatData.studentId,
        instructorId: chatData.instructorId,
        messages: []
      });
      console.log(`Created new chat for booking: ${bookingId}`);
    }

    return await this.chatRepository.addMessage(String(chat?._id), messageData as IMessage);
  }

  async getChatHistory(bookingId: string): Promise<IMessage[]> {
    try {
      const chat = await this.chatRepository.findByBookingId(bookingId);
      if (!chat) {
        return [];
      }
      return chat.messages;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}