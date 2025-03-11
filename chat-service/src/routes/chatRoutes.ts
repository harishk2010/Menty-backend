import express from "express";

import { chatController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/AuthenticatedRoutes";

const router = express.Router();

router.post("",authenticateToken, chatController.createChat.bind(chatController));
router.get("/:bookingId",authenticateToken, chatController.getChat.bind(chatController));
router.get(
  "/history/:bookingId",authenticateToken,
  chatController.getChatHistory.bind(chatController)
);
router.post(
  "/upload-image",
  authenticateToken,
  chatController.uploadChatImage.bind(chatController)
);

export default router;
