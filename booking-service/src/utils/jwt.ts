import jwt from "jsonwebtoken";

import { EnvErrorMsg, JwtErrorMsg } from "./constants";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}


export class JwtService {
  async createToken(payload: Object): Promise<string> {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
    }

    const verifyToken = await jwt.sign(payload, secret, {
      expiresIn: JwtErrorMsg.JWT_EXPIRATION,
    });

    return verifyToken;
  }
  async accessToken(payload: Object): Promise<string> {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
    }
    return jwt.sign(payload, secret, {
      expiresIn: JwtErrorMsg.JWT_EXPIRATION,
    });
  }

  async refreshToken(payload: Object): Promise<string> {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(EnvErrorMsg.JWT_NOT_FOUND);
    }

    const verifyToken = await jwt.sign(payload, secret, {
      expiresIn: JwtErrorMsg.JWT_REFRESH_EXPIRATION,
    });

    return verifyToken;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const secret = process.env.JWT_SECRET || "Sombu";

      const data = await jwt.verify(token, secret);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
