import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import cors from 'cors'
import userRoute from "../../interfaces/routes/UserRoutes";
config()

let app:Application=express()
const PORT:number=Number(process.env.PORT)||6001

const corsOptions = {
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions))



app.use('/',userRoute() )

app.get('/', (req, res)=> {
    res.json('authentication service.....')
})


const start = () => {
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};


export default { start };
