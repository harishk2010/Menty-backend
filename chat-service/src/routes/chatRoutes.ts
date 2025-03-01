// import { chatController } from "../config/dependencyInjector";
// import authenticateToken from "../middlewares/AuthenticatedRoutes";
// import { Router } from "express";

// const router=Router()

// router.post('/', chatController.createChat.bind(chatController));
// router.get('/:bookingId', chatController.getChat.bind(chatController));
// router.get('/:bookingId/history', chatController.getChatHistory.bind(chatController));

//   const chatRoutes= router
//   export default chatRoutes

// routes/chatRoutes.ts
import express from 'express';
// import { ChatController } from '../controllers/ChatController';
// import { ChatRepository } from '../repositories/ChatRepository';
// import { ChatService } from '../services/ChatService';
import { chatController } from "../config/dependencyInjector";

const router = express.Router();
// const chatRepository = new ChatRepository();
// const chatService = new ChatService(chatRepository);
// const chatController = new ChatController(chatService);

// Chat routes
router.post('', chatController.createChat.bind(chatController));
router.get('/:bookingId', chatController.getChat.bind(chatController));
router.get('/history/:bookingId', chatController.getChatHistory.bind(chatController));
router.post('/upload-image', chatController.uploadChatImage.bind(chatController));

export default router;