import { ChatController } from "../controllers/chatController"
import { IChatController } from "../controllers/interfaces/IChatController"
import { ChatRepository } from "../repositories/chatRepository"
import { IChatRepository } from "../repositories/interfaces/IChatRepository"
import { ChatService } from "../services/chatService"
import { IChatService } from "../services/interfaces/IChatService"



const chatRepository:IChatRepository=new ChatRepository()
const chatService:IChatService=new ChatService(chatRepository)

const chatController:IChatController=new ChatController(chatService)

export { chatController }