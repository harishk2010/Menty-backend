import mongoose from "mongoose";
import { MongoDB } from "../utils/constants";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

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
