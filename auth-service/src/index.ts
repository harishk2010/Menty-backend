import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import connectDB from "./config/db";
import cors from 'cors'
import instructorRoutes from "./routes/instructorRoutes";
import studentRoutes from "./routes/studentRoutes";
import adminRoutes from "./routes/adminRoutes";
import consume from "./config/kafka/consumer";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}

let app:Application=express()
const PORT:number=Number(process.env.port)||5001

const corsOptions = {
    credentials: true,
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use((req, res, next) => {
    console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
    next(); 
});

app.use('/instructor',instructorRoutes )

app.use('/student', studentRoutes)

app.use('/admin', adminRoutes)

consume()


const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};
start()
