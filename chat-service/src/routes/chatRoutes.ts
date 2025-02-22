import { chatController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { Router } from "express";

const router=Router()

router.post('/', chatController.createChat.bind(chatController));
router.get('/:bookingId', chatController.getChat.bind(chatController));
router.get('/:bookingId/history', chatController.getChatHistory.bind(chatController));

  const chatRoutes= router
  export default chatRoutes