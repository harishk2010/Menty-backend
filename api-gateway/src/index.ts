import express, { Application ,Request ,Response ,NextFunction } from "express";
import { config } from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser'

config();

const app: Application = express();

const { PORT, FRONTEND_URL, AUTH_URL } = process.env;

console.log("Environment Variables:", { PORT, FRONTEND_URL, AUTH_URL });

const corsOptions = {
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const services = [
    {
        path: AUTH_URL, // Target service URL
        context: "/auth", // Route on your gateway
    },
];

// Setup proxies
services.forEach(({ context, path }) => {
    if (!path || !context) {
        console.error("Invalid service configuration:", { context, path });
        return;
    }

    console.log(`Setting up proxy: ${context} -> ${path}`);

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
