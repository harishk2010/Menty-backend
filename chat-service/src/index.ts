import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import registerSocketHandlers from "./socket/socketHandlers";
import consume from "./config/kafka/consumer";
import chatRoutes from "./routes/chatRoutes";
import { GeneralServerErrorMsg, KafkaError, KafkaSuccess, SocketErrors } from "./utils/constants";
import { StatusCode } from "./utils/enums";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

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
  console.error(SocketErrors.FAILED_TO_REGISTER, error);
}

try {
  consume();
  console.log(KafkaSuccess.CONSUMER_CONNECTED);
} catch (error) {
  console.error(KafkaError.CONSUMER_CONNECTION_FAILED, error);
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);

  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({
      error: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
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
    console.log(SocketErrors.SERVER_CLOSED);

    // Close HTTP server
    httpServer.close(() => {
      process.exit(0);
    });
  } catch (error) {
    console.error(SocketErrors.SHUTDOWN_ERROR, error);
    process.exit(1);
  }
};

start();

export { app, io };
