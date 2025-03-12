import mongoose from "mongoose";
import { config } from "dotenv";
import { MongoDB } from "../utils/constants";
config();

const connectDB = async () => {
  try {
    let connect = await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log(`${MongoDB.SUCCESS}${connect.connection.host}`)
  } catch (error: any) {
    console.error(MongoDB.ERROR)
    throw error;
  }
};

export default connectDB;
