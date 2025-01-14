import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { IInstructor } from "@/models/instructorModel";

// Load environment variables
config();

export class JwtService {
    async createToken(payload: Object): Promise<string> {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Sign the token with the validated secret
        const verifyToken =await jwt.sign(payload, secret, {
            expiresIn: "1h",
        });

        return verifyToken;
    }

    async verifyToken(token:string):Promise<any>{

        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error("JWT_SECRET is not defined in the environment variables");
            }
            const data=await jwt.verify(token,secret)
            return data
        } catch (error) {
            
        }
    }
}
