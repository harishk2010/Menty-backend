import jwt from "jsonwebtoken";
import { config } from "dotenv";
// import { IInstructor } from "@/models/instructorModel";

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
            expiresIn: "1hr",
        });

        return verifyToken;
    }
    async accessToken(payload: Object): Promise<string> {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
console.log(payload,"payyload")
        // Sign the token with the validated secret
        return jwt.sign(payload, secret, {
            expiresIn: "1hr",
        });

        // return verifyToken;
    }
     
    async refreshToken(payload: Object): Promise<string> {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Sign the token with the validated secret
        const verifyToken =await jwt.sign(payload, secret, {
            expiresIn: "6hr",
        });

        return verifyToken;
    }

    async verifyToken(token:string):Promise<any>{

        try {
            console.log("verify ")
            const secret = process.env.JWT_SECRET||"Sombu";
            console.log(secret,"secret")
            
            console.log("Token being verified:", token);
            const data= await jwt.verify(token,secret)
            console.log(data,"verify data")
            return data
        } catch (error) {
            throw error
            
        }
    }
}
