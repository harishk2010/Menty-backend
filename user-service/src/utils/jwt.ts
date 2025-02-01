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

export async function accessToken(payload: Object): Promise<string> {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }
console.log(payload,"payyload")
    // Sign the token with the validated secret
    return jwt.sign(payload, secret, {
        expiresIn: "1hr",
    });
}