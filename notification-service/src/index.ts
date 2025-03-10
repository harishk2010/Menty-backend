import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import consume from "./config/kafka/consumer";
config();

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

consume();
app.get("/", (req, res) => {
  res.json("notificatin service is running ");
});

app.listen(PORT, () => {
  console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
});
