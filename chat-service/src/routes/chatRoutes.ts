import express from "express";

import { chatController } from "../config/dependencyInjector";

const router = express.Router();

router.post("", chatController.createChat.bind(chatController));
router.get("/:bookingId", chatController.getChat.bind(chatController));
router.get(
  "/history/:bookingId",
  chatController.getChatHistory.bind(chatController)
);
router.post(
  "/upload-image",
  chatController.uploadChatImage.bind(chatController)
);

export default router;
