import express, { Application ,Request ,Response ,NextFunction } from "express";
import { config } from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import proxy from 'express-http-proxy'

config();

const app: Application = express();

const { PORT, FRONTEND_URL, AUTH_URL , USER_URL , VERIFICATION_URL ,NOTIFICATION_URL} = process.env;

console.log("Environment Variables:", { PORT, FRONTEND_URL, AUTH_URL , USER_URL ,NOTIFICATION_URL , VERIFICATION_URL});

const corsOptions = {
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cookieParser())
app.use(cors(corsOptions));
// app.use(cookieParser());

// app.use((req, res, next) => {
//     console.log(`LOGGING 📝 : ${req.files} request to: ${req.originalUrl}   , baseurl ${req.baseUrl}  `);
//     next(); 
// });

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
    {
        path: VERIFICATION_URL, // Target service URL
        context: "/verification", // Route on your gateway
    },
];


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
