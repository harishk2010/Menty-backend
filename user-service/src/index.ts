import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDB from "./config/db";
import cors from 'cors'
// import instructorRoutes from "./routes/instructorRoutes";
import studentRoutes from "./routes/studentRoutes";
import consume from "./config/kafka/consumer";
// import adminRoutes from "./routes/adminRoutes";
config()

let app:Application=express()
const PORT:number=Number(process.env.port)||5002

const corsOptions = {
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use(authenticateToken);

// app.use('/auth/instructor',instructorRoutes )
app.use('/student', studentRoutes)
// app.use('/auth/admin', adminRoutes)
consume()
app.use((req, res, next) => {
    console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
    next(); 
});


const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};
start()
