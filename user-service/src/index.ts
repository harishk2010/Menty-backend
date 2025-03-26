import express, { Application, NextFunction, Request, Response } from "express";

import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";
import consume from "./config/kafka/consumer";
import instructorRoutes from "./routes/instructorRoutes";
import verificationRoutes from "./routes/verificationRoutes";
import mentorReviewRoutes from "./routes/mentorReviewRoutes";
import adminDashboardRoutes from "./routes/adminDashboardRoutes";
import { StatusCode } from "./utils/enums";
import { GeneralServerErrorMsg } from "./utils/constants";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}
let app: Application = express();
const PORT: number = Number(process.env.port) || 5002;

const corsOptions = {
  credentials: true,
  origin: String(process.env.FRONTEND_URL),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/student", studentRoutes);
app.use("/instructors", instructorRoutes);
app.use("/verification", verificationRoutes);
app.use("/mentorReview", mentorReviewRoutes);
app.use("/admin", adminDashboardRoutes);

consume();
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);

  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({
      error: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
});
app.use((req, res, next) => {
  console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
  next();
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Server startup failed:", error);
    process.exit(1);
  }
};

start();