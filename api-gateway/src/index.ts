// import express, { Application ,Request ,Response ,NextFunction } from "express";
// import dotenv from "dotenv";
// import { createProxyMiddleware } from "http-proxy-middleware";
// import cors from "cors";
// // import proxy from 'express-http-proxy'
// import morgan from  "morgan" 
// import logger from './logger/logger'
// import { GeneralServerErrorMsg } from "./utils/constants";
// import { StatusCode } from "./utils/enums";

// if (process.env.NODE_ENV === 'production') {
//     dotenv.config({ path: '.env.production' });
//     console.log(process.env.NODE_ENV,"production")
//   } else {
//       dotenv.config({ path: '.env' });
//       console.log(process.env.NODE_ENV,"dev")
//   }
// const app: Application = express();

// const { PORT, FRONTEND_URL, AUTH_URL , USER_URL , ADMIN_URL ,NOTIFICATION_URL,COURSE_URL,BOOKING_URL,CHAT_URL,NODE_ENV} = process.env;
// console.log(PORT, FRONTEND_URL, AUTH_URL , USER_URL , ADMIN_URL ,NOTIFICATION_URL,COURSE_URL,BOOKING_URL,CHAT_URL,NODE_ENV)

// const corsOptions = {
//     credentials: true,
//     origin: FRONTEND_URL,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// };

// // app.use(cookieParser())
// app.use(cors(corsOptions));


// const services = [
//     {
//         path: AUTH_URL, 
//         context: "/api/auth", 
//     },
//     {
//         path: USER_URL, 
//         context: "/api/user", 
//     },
//     {
//         path: NOTIFICATION_URL, 
//         context: "/api/notification", 
//     },
//     {
//         path: ADMIN_URL, 
//         context: "/api/admin", 
//     },
//     {
//         path: COURSE_URL, 
//         context: "/api/course", 
//     },
//     {
//         path: BOOKING_URL, 
//         context: "/api/booking", 
//     },
//     {
//         path: CHAT_URL, 
//         context: "/api/chat", 
//     },
    
// ];
// // app.use('/api/chat', createProxyMiddleware({
// //     target: CHAT_URL,
// //     changeOrigin: true,
// //     ws: true 
// //   }));
  
// // app.use(morgan('dev'))
// app.use(
//     morgan('combined', {
//       stream: {
//         write: (message) => logger.info(message.trim()), // Send Morgan logs to Winston
//       },
//     })
//   );
  

// // Setup proxies
// services.forEach(({ context, path }) => {
//     if (!path || !context) {
//         console.error(GeneralServerErrorMsg.INVALID_SERVICE_CONFIG, { context, path });
//         return;
//     }
//     app.use(
//         context,
//         createProxyMiddleware({
//             target: path,
//             changeOrigin: true,
//             ws:true
//         })
//     );
// });

// app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
//     logger.error(`Error: ${err.message}`);
//     console.error("Error:", err.message);
//     res
//     .status(StatusCode.INTERNAL_SERVER_ERROR)
//     .json({
//       error: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
//       details: err.message,
//     });
// });

// app.listen(PORT, () => {
//     console.log(`API Gateway running at http://localhost:${PORT}`);
// });
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createProxyMiddleware,Options  } from "http-proxy-middleware";
import cors from "cors";
import morgan from "morgan";
import logger from './logger/logger';
import { GeneralServerErrorMsg } from "./utils/constants";
import { StatusCode } from "./utils/enums";

// Load environment variables based on environment
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
    console.log(process.env.NODE_ENV, "production");
} else {
    dotenv.config({ path: '.env' });
    console.log(process.env.NODE_ENV, "dev");
}

const app: Application = express();

const {
    PORT,
    FRONTEND_URL,
    AUTH_URL,
    USER_URL,
    ADMIN_URL,
    NOTIFICATION_URL,
    COURSE_URL,
    BOOKING_URL,
    CHAT_URL,
    NODE_ENV
} = process.env;

console.log(PORT, FRONTEND_URL, AUTH_URL, USER_URL, ADMIN_URL, NOTIFICATION_URL, COURSE_URL, BOOKING_URL, CHAT_URL, NODE_ENV);

const corsOptions = {
    credentials: true,
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

// Set up logging
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

// Create server instance to handle both HTTP and WebSocket
const server = require('http').createServer(app);

// WebSocket handling for socket.io
interface ExtendedProxyOptions extends Options {
    ws?: boolean;
    // Add any other properties that TypeScript complains about
    onProxyReq?: (proxyReq: any, req: any, res: any) => void;
}
console.log("chat chat url", CHAT_URL)

app.use('/socket.io', createProxyMiddleware({
    target: CHAT_URL,
    changeOrigin: true,
    ws: true,  // WebSocket support
    onProxyReq: (proxyReq, req, res) => {
        // Ensuring that the connection remains WebSocket
        proxyReq.setHeader('Connection', 'Upgrade');
        proxyReq.setHeader('Upgrade', 'websocket');
    },
}as ExtendedProxyOptions));

// Handle chat API requests
// app.use('/api/chat', createProxyMiddleware({
//     target: CHAT_URL,
//     changeOrigin: true,
//     ws: true,
//     pathRewrite: { '^/api/chat': '/api/chat' }, // Keep original path
// }));

// Define other services
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
    // Chat service is handled separately above
];

// Setup proxies for other services
services.forEach(({ context, path }) => {
    if (!path || !context) {
        console.error(GeneralServerErrorMsg.INVALID_SERVICE_CONFIG, { context, path });
        return;
    }
    app.use(
        context,
        createProxyMiddleware({
            target: path,
            changeOrigin: true
        })
    );
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`);
    console.error("Error:", err.message);
    res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({
            error: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
            details: err.message,
        });
});

// Start server
server.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
});

// Export for testing purposes
export { app, server };