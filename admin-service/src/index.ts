import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import consume from "./config/kafka/consumer";
import categoryRoutes from "./routes/categoryRoutes";
import adminRoutes from "./routes/adminRoutes";
import { GeneralServerErrorMsg } from "./utils/constants";
import { StatusCode } from "./utils/enums";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  console.log("prod")
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
  console.log("dev")
}

let app: Application = express();
const PORT: number = Number(process.env.port) || 5004;

const corsOptions = {
  origin: String(process.env.FRONTEND_URL),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/category", categoryRoutes);
app.use("/admin", adminRoutes);

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
    console.log("first")
    await connectDB();
    console.log("second")
    app.listen(PORT, () => {
      console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Server startup failed:", error);
    process.exit(1);
  }
};

start();
