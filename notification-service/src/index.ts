import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import consume from "./config/kafka/consumer";
import { StatusCode } from "./utils/enums";
import { GeneralServerErrorMsg } from "./utils/constants";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}
let app: Application = express();
const PORT: number = Number(process.env.port) || 5003;

const corsOptions = {
  origin: String(process.env.FRONTEND_URL),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
  next();
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);

  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({
      error: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
});

consume();

app.listen(PORT, () => {
  console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
});
