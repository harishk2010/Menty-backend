// src/socket/socketHandlers.ts
import { Server, Socket } from "socket.io";

// Types
interface MessagePayload {
  roomId: string;
  chatId: string;
  message: string;
  sender: string;
  senderType: string;
}

interface TypingData {
  roomId: string;
  userId: string;
}

interface MessageResponse {
  content: string;
  sender: string;
  messageBy: string;
  senderType: string;
  createdAt: string;
}

// Active users and typing state management
const activeUsers = new Map<string, string>();
const typingTimeouts = new Map<string, NodeJS.Timeout>();
const TYPING_TIMEOUT = 3000; // 3 seconds

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
    
    console.log(`User ${userIdToRemove} disconnected and cleaned up`);
  }
};

export default function registerSocketHandlers(io: Server) {
  console.log("Socket handlers initialized");
  
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Room management
    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      // Notify room members of new join
      socket.to(roomId).emit("user-joined", { socketId: socket.id, roomId });
    });

    // Message handling
    socket.on("send-message", async (messagePayload: MessagePayload) => {
      console.log("Received message payload:", messagePayload);
      const { chatId, roomId, message, sender, senderType } = messagePayload;

      try {
        // Create message response
        const messageResponse: MessageResponse = {
          content: message,
          sender: sender,
          messageBy: sender,
          senderType: senderType || "Unknown",
          createdAt: new Date().toISOString()
        };
          console.log(messageResponse)
          console.log("Existing rooms:", io.sockets.adapter.rooms);
console.log(`Room ${roomId} exists?`, io.sockets.adapter.rooms.has(roomId));

        // Emit message to room
        io.to(roomId).emit("receive-message", messageResponse);
        // io.to(socket.id).emit("receive-message", messageResponse);
        // io.emit("receive-message", messageResponse);
        console.log("--rec")

        // Clear typing indicator for sender
        clearTypingTimeout(sender, roomId, socket);

      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("message-error", {
          error: "Internal server error",
          roomId
        });
      }
    });

    // User activity tracking
    socket.on("user-active", (userId: string) => {
      if (!userId) return;
      
      activeUsers.set(userId, socket.id);
      emitActiveUsersUpdate(io);
      console.log(`User ${userId} marked as active`);
    });

    socket.on("user-inactive", (userId: string) => {
      if (!userId) return;
      
      activeUsers.delete(userId);
      emitActiveUsersUpdate(io);
      console.log(`User ${userId} marked as inactive`);
    });

    // Typing indicators
    socket.on("typing", (data: TypingData) => {
      const { roomId, userId } = data;
      console.log(data,"typing data")
      
      clearTypingTimeout(userId, roomId, socket);

      // Emit new typing event
      socket.to(roomId).emit("show-typing", { roomId, userId });

      // Set new timeout
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

    // Connection management
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