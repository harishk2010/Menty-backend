import express, { Application ,Request ,Response ,NextFunction } from "express";
import { config } from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
// import proxy from 'express-http-proxy'
import morgan from  "morgan" 

config();

const app: Application = express();

const { PORT, FRONTEND_URL, AUTH_URL , USER_URL , VERIFICATION_URL ,NOTIFICATION_URL} = process.env;

console.log("Environment Variables:", { PORT, FRONTEND_URL, AUTH_URL , USER_URL ,NOTIFICATION_URL , VERIFICATION_URL});

const corsOptions = {
    credentials: true,
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// app.use(cookieParser())
app.use(cors(corsOptions));


const services = [
    {
        path: AUTH_URL, // Target service URL
        context: "/auth", // Route on your gateway
    },
    {
        path: USER_URL, // Target service URL
        context: "/user", // Route on your gateway
    },
    {
        path: NOTIFICATION_URL, // Target service URL
        context: "/notification", // Route on your gateway
    },
    
];

app.use(morgan('dev'))

// Setup proxies
services.forEach(({ context, path }) => {
    if (!path || !context) {
        console.error("Invalid service configuration:", { context, path });
        return;
    }
    app.use(
        context,
        createProxyMiddleware({
            target: path,
            changeOrigin: true,
        })
    );
});

app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
});
