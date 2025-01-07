import express, { Application } from "express"
import {config} from 'dotenv'
import { createProxyMiddleware } from "http-proxy-middleware"
import cors from 'cors'
import cookieParser from 'cookie-parser'
config()

console.log("hello")

const app: Application = express()

const {
    PORT,
    FRONTEND_URL,
    AUTH_URL
} = process.env
console.log(PORT,FRONTEND_URL)



const corsOptions = {
    origin: String(FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};


app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


const services = [
    {

        path: AUTH_URL,

    }
]
app.listen(PORT,()=>{
    console.log(`project running at http://localhost:${PORT}`)
})
