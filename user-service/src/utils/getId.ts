import jwt from "jsonwebtoken";
import { Request } from "express";

export interface CustomRequest extends Request {
  user?: {
    user: string;
    role: string;
    iat: number;
    exp: number;
  };
}

const getId = (token: string, req: CustomRequest): string | null => {
  try {
    const accessToken = req.cookies["accessToken"];
    const decodedData: any = jwt.decode(accessToken);
    const { id } = decodedData;
    return id;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export default getId;
