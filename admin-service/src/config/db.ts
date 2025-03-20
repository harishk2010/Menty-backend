import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoDB } from "../utils/constants";

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
    console.log(process.env.MONGO_URI,"production")
  } else {
    console.log(process.env.MONGO_URI,"dev")
    dotenv.config({ path: '.env' });
  }

const connectDB=async()=>{
    try {
      console.log(process.env.MONGO_URI,"inside db")

       
        let connect=await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`${MongoDB.SUCCESS}${connect.connection.host}`)
    } catch (error) {
      
        console.error(MongoDB.ERROR)
        throw error
    }
}

export default connectDB