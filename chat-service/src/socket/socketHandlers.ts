import { Server, Socket } from "socket.io";
import { ChatService } from "../services/chatService";
import { ChatRepository } from "../repositories/chatRepository";
import { BookingModel } from "../models/bookingModel";

// Initialize chat service for database operations
const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);

// Types
interface MessagePayload {
  roomId: string;
  chatId: string;
  message: string;
  sender: string;
  senderType: "student" | "instructor"; // Changed from string to union type
  messageType?: "text" | "image";
  imageUrl?: string;
  bookingId: string;
}

interface TypingData {
  roomId: string;
  userId: string;
}

interface MessageResponse {
  content: string;
  sender: string;
  messageBy: string;
  senderType: "student" | "instructor" | "Unknown";
  createdAt: string;
  messageType: "text" | "image";
  imageUrl?: string;
}

// Active users and typing state management
const activeUsers = new Map<string, string>();
const typingTimeouts = new Map<string, NodeJS.Timeout>();
const TYPING_TIMEOUT = 1000; // 3 seconds

// Utility functions
const emitActiveUsersUpdate = (io: Server) => {
  io.emit("update-active-users", Array.from(activeUsers.keys()));
};

const clearTypingTimeout = (userId: string, roomId: string, socket: Socket) => {
  const existingTimeout = typingTimeouts.get(userId);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
    typingTimeouts.delete(userId);
    socket.to(roomId).emit("hide-typing", { roomId, userId });
  }
};

const handleUserDisconnect = (socket: Socket, io: Server) => {
  let userIdToRemove: string | undefined;

  // Find disconnected user
  activeUsers.forEach((socketId, userId) => {
    if (socketId === socket.id) {
      userIdToRemove = userId;
    }
  });

  // Clean up user data
  if (userIdToRemove) {
    activeUsers.delete(userIdToRemove);
    emitActiveUsersUpdate(io);

    // Clear typing timeouts
    typingTimeouts.forEach((timeout, userId) => {
      if (activeUsers.get(userId) === socket.id) {
        clearTimeout(timeout);
        typingTimeouts.delete(userId);
      }
    });
  }
};

export default function registerSocketHandlers(io: Server) {
  console.log("Socket handlers initialized");

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Room management
    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      // Notify room members of new join
      socket.to(roomId).emit("user-joined", { socketId: socket.id, roomId });
    });

    // Message handling
    socket.on("send-message", async (messagePayload: MessagePayload) => {
      const {
        bookingId,
        roomId,
        message,
        sender,
        senderType,
        messageType,
        imageUrl,
      } = messagePayload;

      try {
        let studentId: string | undefined;
        let instructorId: string | undefined;

        if (senderType === "student") {
          studentId = sender;

          const bookingDetails = await BookingModel.findById(bookingId);
          instructorId = bookingDetails?.instructorId;
        } else {
          instructorId = sender;

          const bookingDetails = await BookingModel.findById(bookingId);
          studentId = bookingDetails?.studentId;
        }
        // Create message response
        const messageResponse: MessageResponse = {
          content: message,
          sender: sender,
          messageBy: sender,
          senderType: senderType || "Unknown",
          createdAt: new Date().toISOString(),
          messageType: messageType || "text",
          imageUrl: imageUrl,
        };

        try {
          const messageData = {
            content: message,
            sender: sender,
            senderType: senderType,
            bookingId: bookingId,
            messageType: messageType || "text",
            imageUrl: imageUrl,
            createdAt: new Date(),
          };

          // await chatService.addMessage(bookingId, messageData);
          const chatData = {
            studentId: String(studentId),
            instructorId: String(instructorId),
          };
          await chatService.addMessage(bookingId, messageData, chatData);
        } catch (dbError) {
          console.error("Error saving message to database:", dbError);
        }

        // Emit message to room
        io.to(roomId).emit("receive-message", messageResponse);

        // Clear typing indicator for sender
        clearTypingTimeout(sender, roomId, socket);
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("message-error", {
          error: "Internal server error",
          roomId,
        });
      }
    });

    // User activity tracking
    socket.on("user-active", (userId: string) => {
      if (!userId) return;

      activeUsers.set(userId, socket.id);
      emitActiveUsersUpdate(io);
    });

    socket.on("user-inactive", (userId: string) => {
      if (!userId) return;

      activeUsers.delete(userId);
      emitActiveUsersUpdate(io);
    });

    // Typing indicators
    socket.on("typing", (data: TypingData) => {
      const { roomId, userId } = data;

      clearTypingTimeout(userId, roomId, socket);

      socket.to(roomId).emit("show-typing", { roomId, userId });

      const timeout = setTimeout(() => {
        socket.to(roomId).emit("hide-typing", { roomId, userId });
        typingTimeouts.delete(userId);
      }, TYPING_TIMEOUT);

      typingTimeouts.set(userId, timeout);
    });

    socket.on("stop-typing", (data: TypingData) => {
      const { roomId, userId } = data;
      clearTypingTimeout(userId, roomId, socket);
    });

    socket.on("disconnect", () => {
      handleUserDisconnect(socket, io);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      socket.emit("error", { message: "An error occurred" });
    });
  });
}
