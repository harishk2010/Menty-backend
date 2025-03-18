import express, { Application ,Request ,Response ,NextFunction } from "express";
import { config } from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
// import proxy from 'express-http-proxy'
import morgan from  "morgan" 
import logger from './logger/logger'
import { GeneralServerErrorMsg } from "./utils/constants";
import { StatusCode } from "./utils/enums";

config();

const app: Application = express();

const { PORT, FRONTEND_URL, AUTH_URL , USER_URL , ADMIN_URL ,NOTIFICATION_URL,COURSE_URL,BOOKING_URL,CHAT_URL} = process.env;

const corsOptions = {
    credentials: true,
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// app.use(cookieParser())
app.use(cors(corsOptions));


const services = [
    {
        path: AUTH_URL, 
        context: "/api/auth", 
    },
    {
        path: USER_URL, 
        context: "/api/user", 
    },
    {
        path: NOTIFICATION_URL, 
        context: "/api/notification", 
    },
    {
        path: ADMIN_URL, 
        context: "/api/admin", 
    },
    {
        path: COURSE_URL, 
        context: "/api/course", 
    },
    {
        path: BOOKING_URL, 
        context: "/api/booking", 
    },
    {
        path: CHAT_URL, 
        context: "/api/chat", 
    },
    
];

// app.use(morgan('dev'))
app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()), // Send Morgan logs to Winston
      },
    })
  );
  

// Setup proxies
services.forEach(({ context, path }) => {
    if (!path || !context) {
        console.error(GeneralServerErrorMsg.INVALID_SERVICE_CONFIG, { context, path });
        return;
    }
    app.use(
        context,
        createProxyMiddleware({
            target: path,
            changeOrigin: true,
            ws:true
        })
    );
});

app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
    logger.error(`Error: ${err.message}`);
    console.error("Error:", err.message);
    res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({
      error: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
});
