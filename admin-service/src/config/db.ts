import mongoose from "mongoose";
import { config } from "dotenv";
config()

const connectDB=async()=>{
    try {
        console.log(process.env.MONGO_URL,"process.env.MONGO_URL")
        let connect=await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`DB connected:${connect.connection.host}`)
    } catch (error) {
        console.log(error);
        throw error
    }
}

export default connectDB