import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDB from "./config/db";
import cors from 'cors'
config()

let app:Application=express()
const PORT:number=Number(process.env.port)||5001

const corsOptions = {
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// app.use('/auth',userRoute() )

app.get('/', (req, res)=> {
    res.json('authentication service.....')
})


const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};
start()
