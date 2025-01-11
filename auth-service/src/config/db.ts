import mongoose from "mongoose";
import { config } from "dotenv";
config()

const connectDB=async()=>{
    try {
        let connect=await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`DB connected:${connect.connection.host}`)
    } catch (error:any) {
        console.log(error.message);
    }
}

export default connectDB