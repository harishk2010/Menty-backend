import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import cors from 'cors'
import userRoute from "../../interfaces/routes/UserRoutes";
import { connectToDatabase } from "./db";
config()

let app:Application=express()
const PORT:number=Number(process.env.PORT)||5001

const corsOptions = {
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/auth',userRoute() )

app.get('/', (req, res)=> {
    res.json('authentication service.....')
})


const start = async() => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};


export default { start };
