import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDB from "./config/db";
import cors from 'cors'
import instructorRoutes from "./routes/instructorRoutes";
import studentRoutes from "./routes/studentRoutes";
import adminRoutes from "./routes/adminRoutes";
import proxy = require("http-proxy-middleware");
import consume from "./config/kafka/consumer";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { JwtService } from "./utils/jwt";
config()

let app:Application=express()
const PORT:number=Number(process.env.port)||5001

const corsOptions = {
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(errorMiddleware);

app.use((req, res, next) => {
    console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
    next(); 
});

app.use('/instructor',instructorRoutes )

app.use('/student', studentRoutes)

app.use('/admin', adminRoutes)

consume()
app.get('/', (req, res) => {
    res.json('auth service is running ')
})
app.post("/api/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const jwt=new JwtService()
        const payload = jwt.verifyToken(refreshToken);
        const newAccessToken = jwt.accessToken({ role: payload });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: "Invalid refresh token" });
    }
});


const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};
start()
