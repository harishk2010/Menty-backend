import { AuthErrorMsg } from "../utils/constants";
import verifyToken from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { Roles, StatusCode } from "../utils/enums";

export const isInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const Token = req.cookies.accessToken;
    if (!Token) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }

    const decode = await verifyToken(Token);
    if (decode) {
      if (decode.role !== Roles.INSTRUCTOR) {
        res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
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
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }
    const decode = await verifyToken(Token);
    if (decode) {
      if (decode.role !== Roles.STUDENT) {
        res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
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
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }
    const decode = await verifyToken(Token);
    if (decode) {
      if (decode.role !== Roles.ADMIN) {
        res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
        return;
      }
    }

    next();
  } catch (error) {
    throw error;
  }
};
export const isAdminOrInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const Token = req.cookies.accessToken;
    if (!Token) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }
    const decode = await verifyToken(Token);
    if (decode) {
      if (decode.role === Roles.ADMIN || decode.role === Roles.INSTRUCTOR) {
        next();
      } else {
        res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
        return;
      }
    }
  } catch (error) {
    throw error;
  }
};
export const isAdminOrStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const Token = req.cookies.accessToken;
    if (!Token) {
      res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
      return;
    }
    const decode = await verifyToken(Token);
    if (decode) {
      if (decode.role === Roles.ADMIN || decode.role === Roles.STUDENT) {
        next();
      } else {
        res.status(StatusCode.UNAUTHORIZED).send(AuthErrorMsg.ACCESS_FORBIDDEN);
        return;
      }
    }
  } catch (error) {
    throw error;
  }
};
