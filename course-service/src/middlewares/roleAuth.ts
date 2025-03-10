import { JwtService } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

export const isInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const Token = req.cookies.accessToken;
    if (!Token) {
      res.status(401).send("Acess Forbidden No access Token");
      return;
    }
    const JWT = new JwtService();
    const decode = await JWT.verifyToken(Token);
    if (decode) {
      if (decode.role !== "instructor") {
        res.status(401).send("Access Forbidden");
        return;
      }
    }

    next();
  } catch (error) {
    throw error;
  }
};
export const isStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const Token = req.cookies.accessToken;
    if (!Token) {
      res.status(401).send("Acess Forbidden No access Token");
      return;
    }
    const JWT = new JwtService();
    const decode = await JWT.verifyToken(Token);
    if (decode) {
      if (decode.role !== "student") {
        res.status(401).send("Access Forbidden");
        return;
      }
    }

    next();
  } catch (error) {
    throw error;
  }
};
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const Token = req.cookies.accessToken;
    if (!Token) {
      res.status(401).send("Acess Forbidden No access Token");
      return;
    }
    const JWT = new JwtService();
    const decode = await JWT.verifyToken(Token);
    if (decode) {
      if (decode.role !== "admin") {
        res.status(401).send("Access Forbidden");
        return;
      }
    }

    next();
  } catch (error) {
    throw error;
  }
};
