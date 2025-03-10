import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import registerSocketHandlers from "./socket/socketHandlers";
import consume from "./config/kafka/consumer";
import chatRoutes from "./routes/chatRoutes";

config();

const app: Application = express();
const httpServer = createServer(app);
const PORT: number = Number(process.env.PORT) || 5007;

const io = new Server(httpServer, {
  cors: {
    origin: String(process.env.FRONTEND_URL),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Add explicit transport options
  pingTimeout: 60000, // Increase ping timeout to handle slower connections
  pingInterval: 25000, // Adjust ping interval
  connectTimeout: 5000, // Connection timeout
  // Add error handling for connection issues
  allowEIO3: true, // Enable compatibility mode if needed
});

// Enhanced CORS configuration
const corsOptions = {
  origin: String(process.env.FRONTEND_URL),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200, // Handle legacy browser issues
};

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: process.env.SERVICE });
});

app.use("/", chatRoutes);

try {
  registerSocketHandlers(io);
  console.log("Socket handlers registered successfully");
} catch (error) {
  console.error("Failed to register socket handlers:", error);
}

try {
  consume();
  console.log("Kafka consumer initialized successfully");
} catch (error) {
  console.error("Failed to initialize Kafka consumer:", error);
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  const errorResponse = {
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
  res.status(500).json(errorResponse);
});

// Logging middleware with request timing
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `LOGGING 📝 : ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

const start = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    // Server startup
    httpServer.listen(PORT, () => {});

    // Handle server shutdown gracefully
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  try {
    await io.close();
    console.log("Socket.IO server closed");

    // Close HTTP server
    httpServer.close(() => {
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

start();

export { app, io };
