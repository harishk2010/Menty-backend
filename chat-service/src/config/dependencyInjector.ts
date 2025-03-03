import { ChatController } from "../controllers/chatController"
import { IChatController } from "../interfaces/IChatController"
import { ChatRepository } from "../repositories/chatRepository"
import { IChatRepository } from "../interfaces/IChatRepository"
import { ChatService } from "../services/chatService"
import { IChatService } from "../interfaces/IChatService"



const chatRepository:IChatRepository=new ChatRepository()
const chatService:IChatService=new ChatService(chatRepository)

const chatController:IChatController=new ChatController(chatService)

export { chatController }