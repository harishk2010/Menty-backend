// // src/socket/socketHandlers.ts
// import { Server, Socket } from "socket.io";

// // Types
// interface MessagePayload {
//   roomId: string;
//   chatId: string;
//   message: string;
//   sender: string;
//   senderType: string;
// }

// interface TypingData {
//   roomId: string;
//   userId: string;
// }

// interface MessageResponse {
//   content: string;
//   sender: string;
//   messageBy: string;
//   senderType: string;
//   createdAt: string;
// }

// // Active users and typing state management
// const activeUsers = new Map<string, string>();
// const typingTimeouts = new Map<string, NodeJS.Timeout>();
// const TYPING_TIMEOUT = 3000; // 3 seconds

// // Utility functions
// const emitActiveUsersUpdate = (io: Server) => {
//   io.emit("update-active-users", Array.from(activeUsers.keys()));
// };

// const clearTypingTimeout = (userId: string, roomId: string, socket: Socket) => {
//   const existingTimeout = typingTimeouts.get(userId);
//   if (existingTimeout) {
//     clearTimeout(existingTimeout);
//     typingTimeouts.delete(userId);
//     socket.to(roomId).emit("hide-typing", { roomId, userId });
//   }
// };

// const handleUserDisconnect = (socket: Socket, io: Server) => {
//   let userIdToRemove: string | undefined;
  
//   // Find disconnected user
//   activeUsers.forEach((socketId, userId) => {
//     if (socketId === socket.id) {
//       userIdToRemove = userId;
//     }
//   });

//   // Clean up user data
//   if (userIdToRemove) {
//     activeUsers.delete(userIdToRemove);
//     emitActiveUsersUpdate(io);
    
//     // Clear typing timeouts
//     typingTimeouts.forEach((timeout, userId) => {
//       if (activeUsers.get(userId) === socket.id) {
//         clearTimeout(timeout);
//         typingTimeouts.delete(userId);
//       }
//     });
    
//     console.log(`User ${userIdToRemove} disconnected and cleaned up`);
//   }
// };

// export default function registerSocketHandlers(io: Server) {
//   console.log("Socket handlers initialized");
  
//   io.on("connection", (socket: Socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Room management
//     socket.on("join-room", (roomId: string) => {
//       socket.join(roomId);
//       console.log(`User ${socket.id} joined room ${roomId}`);
//       // Notify room members of new join
//       socket.to(roomId).emit("user-joined", { socketId: socket.id, roomId });
//     });

//     // Message handling
//     socket.on("send-message", async (messagePayload: MessagePayload) => {
//       console.log("Received message payload:", messagePayload);
//       const { chatId, roomId, message, sender, senderType } = messagePayload;

//       try {
//         // Create message response
//         const messageResponse: MessageResponse = {
//           content: message,
//           sender: sender,
//           messageBy: sender,
//           senderType: senderType || "Unknown",
//           createdAt: new Date().toISOString()
//         };
//           console.log(messageResponse)
//           console.log("Existing rooms:", io.sockets.adapter.rooms);
// console.log(`Room ${roomId} exists?`, io.sockets.adapter.rooms.has(roomId));

//         // Emit message to room
//         io.to(roomId).emit("receive-message", messageResponse);
//         // io.to(socket.id).emit("receive-message", messageResponse);
//         // io.emit("receive-message", messageResponse);
//         console.log("--rec")

//         // Clear typing indicator for sender
//         clearTypingTimeout(sender, roomId, socket);

//       } catch (error) {
//         console.error("Error handling message:", error);
//         socket.emit("message-error", {
//           error: "Internal server error",
//           roomId
//         });
//       }
//     });

//     // User activity tracking
//     socket.on("user-active", (userId: string) => {
//       if (!userId) return;
      
//       activeUsers.set(userId, socket.id);
//       emitActiveUsersUpdate(io);
//       console.log(`User ${userId} marked as active`);
//     });

//     socket.on("user-inactive", (userId: string) => {
//       if (!userId) return;
      
//       activeUsers.delete(userId);
//       emitActiveUsersUpdate(io);
//       console.log(`User ${userId} marked as inactive`);
//     });

//     // Typing indicators
//     socket.on("typing", (data: TypingData) => {
//       const { roomId, userId } = data;
//       console.log(data,"typing data")
      
//       clearTypingTimeout(userId, roomId, socket);

//       // Emit new typing event
//       socket.to(roomId).emit("show-typing", { roomId, userId });

//       // Set new timeout
//       const timeout = setTimeout(() => {
//         socket.to(roomId).emit("hide-typing", { roomId, userId });
//         typingTimeouts.delete(userId);
//       }, TYPING_TIMEOUT);

//       typingTimeouts.set(userId, timeout);
//     });

//     socket.on("stop-typing", (data: TypingData) => {
//       const { roomId, userId } = data;
//       clearTypingTimeout(userId, roomId, socket);
//     });

//     // Connection management
//     socket.on("disconnect", () => {
//       handleUserDisconnect(socket, io);
//     });

//     // Error handling
//     socket.on("error", (error) => {
//       console.error("Socket error:", error);
//       socket.emit("error", { message: "An error occurred" });
//     });
//   });
// }

// src/socket/socketHandlers.ts
///////////////////////////////////////////////////////////

// import { Server, Socket } from "socket.io";

// // Types
// interface MessagePayload {
//   roomId: string;
//   chatId: string;
//   message: string;
//   sender: string;
//   senderType: string;
//   messageType?: 'text' | 'image';
//   imageUrl?: string;
// }

// interface TypingData {
//   roomId: string;
//   userId: string;
// }

// interface MessageResponse {
//   content: string;
//   sender: string;
//   messageBy: string;
//   senderType: string;
//   createdAt: string;
//   messageType: 'text' | 'image';
//   imageUrl?: string;
// }

// // Active users and typing state management
// const activeUsers = new Map<string, string>();
// const typingTimeouts = new Map<string, NodeJS.Timeout>();
// const TYPING_TIMEOUT = 3000; // 3 seconds

// // Utility functions
// const emitActiveUsersUpdate = (io: Server) => {
//   io.emit("update-active-users", Array.from(activeUsers.keys()));
// };

// const clearTypingTimeout = (userId: string, roomId: string, socket: Socket) => {
//   const existingTimeout = typingTimeouts.get(userId);
//   if (existingTimeout) {
//     clearTimeout(existingTimeout);
//     typingTimeouts.delete(userId);
//     socket.to(roomId).emit("hide-typing", { roomId, userId });
//   }
// };

// const handleUserDisconnect = (socket: Socket, io: Server) => {
//   let userIdToRemove: string | undefined;
  
//   // Find disconnected user
//   activeUsers.forEach((socketId, userId) => {
//     if (socketId === socket.id) {
//       userIdToRemove = userId;
//     }
//   });

//   // Clean up user data
//   if (userIdToRemove) {
//     activeUsers.delete(userIdToRemove);
//     emitActiveUsersUpdate(io);
    
//     // Clear typing timeouts
//     typingTimeouts.forEach((timeout, userId) => {
//       if (activeUsers.get(userId) === socket.id) {
//         clearTimeout(timeout);
//         typingTimeouts.delete(userId);
//       }
//     });
    
//     console.log(`User ${userIdToRemove} disconnected and cleaned up`);
//   }
// };

// export default function registerSocketHandlers(io: Server) {
//   console.log("Socket handlers initialized");
  
//   io.on("connection", (socket: Socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Room management
//     socket.on("join-room", (roomId: string) => {
//       socket.join(roomId);
//       console.log(`User ${socket.id} joined room ${roomId}`);
//       // Notify room members of new join
//       socket.to(roomId).emit("user-joined", { socketId: socket.id, roomId });
//     });

//     // Message handling
//     socket.on("send-message", async (messagePayload: MessagePayload) => {
//       console.log("Received message payload:", messagePayload);
//       const { chatId, roomId, message, sender, senderType, messageType, imageUrl } = messagePayload;

//       try {
//         // Create message response
//         const messageResponse: MessageResponse = {
//           content: message,
//           sender: sender,
//           messageBy: sender,
//           senderType: senderType || "Unknown",
//           createdAt: new Date().toISOString(),
//           messageType: messageType || 'text',
//           imageUrl: imageUrl
//         };
//           console.log(messageResponse);
//           console.log("Existing rooms:", io.sockets.adapter.rooms);
//           console.log(`Room ${roomId} exists?`, io.sockets.adapter.rooms.has(roomId));

//         // Emit message to room
//         io.to(roomId).emit("receive-message", messageResponse);
//         console.log("--rec");

//         // Clear typing indicator for sender
//         clearTypingTimeout(sender, roomId, socket);

//       } catch (error) {
//         console.error("Error handling message:", error);
//         socket.emit("message-error", {
//           error: "Internal server error",
//           roomId
//         });
//       }
//     });

//     // User activity tracking
//     socket.on("user-active", (userId: string) => {
//       if (!userId) return;
      
//       activeUsers.set(userId, socket.id);
//       emitActiveUsersUpdate(io);
//       console.log(`User ${userId} marked as active`);
//     });

//     socket.on("user-inactive", (userId: string) => {
//       if (!userId) return;
      
//       activeUsers.delete(userId);
//       emitActiveUsersUpdate(io);
//       console.log(`User ${userId} marked as inactive`);
//     });

//     // Typing indicators
//     socket.on("typing", (data: TypingData) => {
//       const { roomId, userId } = data;
//       console.log(data,"typing data");
      
//       clearTypingTimeout(userId, roomId, socket);

//       // Emit new typing event
//       socket.to(roomId).emit("show-typing", { roomId, userId });

//       // Set new timeout
//       const timeout = setTimeout(() => {
//         socket.to(roomId).emit("hide-typing", { roomId, userId });
//         typingTimeouts.delete(userId);
//       }, TYPING_TIMEOUT);

//       typingTimeouts.set(userId, timeout);
//     });

//     socket.on("stop-typing", (data: TypingData) => {
//       const { roomId, userId } = data;
//       clearTypingTimeout(userId, roomId, socket);
//     });

//     // Connection management
//     socket.on("disconnect", () => {
//       handleUserDisconnect(socket, io);
//     });

//     // Error handling
//     socket.on("error", (error) => {
//       console.error("Socket error:", error);
//       socket.emit("error", { message: "An error occurred" });
//     });
//   });
// }

// src/socket/socketHandlers.ts
import { Server, Socket } from "socket.io";
import { ChatService } from '../services/chatService';
import { ChatRepository } from '../repositories/chatRepository';
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
  senderType: "student" | "instructor";  // Changed from string to union type
  messageType?: 'text' | 'image';
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
  messageType: 'text' | 'image';
  imageUrl?: string;
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
      const { bookingId, roomId, message, sender, senderType, messageType, imageUrl } = messagePayload;

      try {

        let studentId: string | undefined;
    let instructorId: string | undefined;
    
    if (senderType === 'student') {
      studentId = sender;
      // You need to get the instructorId from somewhere - perhaps the booking?
      // For now, we'll need to query the booking
      const bookingDetails = await BookingModel.findById(bookingId); // You'll need to implement this
      instructorId = bookingDetails?.instructorId;
    } else {
      instructorId = sender;
      // Similarly, get the studentId from the booking
      const bookingDetails = await BookingModel.findById(bookingId); // You'll need to implement this
      studentId = bookingDetails?.studentId;
    }
        // Create message response
        const messageResponse: MessageResponse = {
          content: message,
          sender: sender,
          messageBy: sender,
          senderType: senderType || "Unknown",
          createdAt: new Date().toISOString(),
          messageType: messageType || 'text',
          imageUrl: imageUrl
        };
        
        // IMPORTANT: Save message to database
        try {
          // Create messageData object for database
          const messageData = {
            content: message,
            sender: sender,
            senderType: senderType,
            bookingId: bookingId,
            messageType: messageType || 'text',
            imageUrl: imageUrl,
            createdAt: new Date()
          };
          
          // Save to database using chatService
          // await chatService.addMessage(bookingId, messageData);
          const chatData= { studentId:String(studentId), instructorId:String(instructorId) }
          await chatService.addMessage(bookingId, messageData, chatData);
          console.log("Message saved to database:", messageData);
        } catch (dbError) {
          console.error("Error saving message to database:", dbError);
          // Continue with socket emission even if DB save fails
        }
        
        console.log(messageResponse);
        console.log("Existing rooms:", io.sockets.adapter.rooms);
        console.log(`Room ${roomId} exists?`, io.sockets.adapter.rooms.has(roomId));

        // Emit message to room
        io.to(roomId).emit("receive-message", messageResponse);
        console.log("--rec");

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
      console.log(data,"typing data");
      
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