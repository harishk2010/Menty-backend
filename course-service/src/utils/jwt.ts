import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

export default async function verifyToken(payload:string):Promise<any>{
    try {
        const secret=process.env.JWT_SECRET 
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }
        const result=await jwt.verify(payload,secret)
        return result
        
    } catch (error) {
        console.log(error)
        
    }
}
