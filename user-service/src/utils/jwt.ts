import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { EnvErrorMsg, JwtErrorMsg } from "./constants";
config();

export default async function verifyToken(payload: string): Promise<any> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        EnvErrorMsg.JWT_NOT_FOUND
      );
    }
    const result = await jwt.verify(payload, secret);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function accessToken(payload: Object): Promise<string> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
  }
  // Sign the token with the validated secret
  return jwt.sign(payload, secret, {
    expiresIn: JwtErrorMsg.JWT_EXPIRATION,
  });
}
