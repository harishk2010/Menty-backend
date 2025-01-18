import { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";  // Import cookie-parser
import { JwtService } from "../utils/jwt"; // Adjust the path as per your project structure

interface AuthenticatedRequest extends Request {
  user?: {
    user: string;
    role: string;
    iat: number;
    exp: number;
  };
}

const jwtService = new JwtService();

const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("Auth middleware entered");

  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];
  console.log("Cookies received:", req.cookies);
  console.log("accessToken:", accessToken);

  if (!accessToken) {
    if (!refreshToken) {
      return res.status(401).send({
        failToken: true,
        message: "No access or refresh token provided",
      });
    }

    try {
      const refreshPayload = await jwtService.verifyToken(refreshToken);
      console.log("refreshedPayload:", refreshPayload);

      if (!refreshPayload) {
        return res.status(401).send({
          message: "Invalid refresh token. Please log in.",
        });
      }

      const newAccessToken = await jwtService.accessToken({
        email: refreshPayload.email,
        role: refreshPayload.role,
      });
      console.log(newAccessToken,"Generated new access token");
      console.log(req.user,"reqqqqqqqqqqqqq")
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Make sure to set this flag appropriately
        // sameSite: "None", 
        path: "/",
      });
      console.log(req.user,"reqqqqqqqqqqqqq11")

      req.user = refreshPayload;
      console.log(req.user,"reqqqqqqqqqqqqq22")
      res.send({})
      // return next()
    } catch (refreshErr: any) {
      console.error("Error verifying refresh token:", refreshErr);
      return res.status(401).send({
        message: "Session expired. Please log in again.",
      });
    }
  }

  try {
    const accessPayload = await jwtService.verifyToken(accessToken);
    if (!accessPayload) {
      return res.status(400).send({
        message: "Invalid access token. Please log in.",
      });
    }

    console.log("Access token verified");
    req.user = accessPayload;
    return next();
  } catch (err: any) {
    console.log("Access token verification failed:", err);

    if (err.name === "TokenExpiredError") {
      if (!refreshToken) {
        return res.status(401).send({
          failToken: true,
          message: "Access token expired and no refresh token provided.",
        });
      }

      try {
        const refreshPayload = await jwtService.verifyToken(refreshToken);
        if (!refreshPayload) {
          return res.status(401).send({
            message: "Invalid refresh token. Please log in.",
          });
        }

        const newAccessToken = await jwtService.accessToken({
          user: refreshPayload.user,
          role: refreshPayload.role,
        });
       
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
         
        });
       
        req.user = refreshPayload;
        
        return next();
      } catch (refreshErr: any) {
        console.error("Error verifying refresh token:", refreshErr);
        return res.status(401).send({
          message: "Session expired. Please log in again.",
        });
      }
    }

    return res.status(400).send({
      message: "Invalid access token. Please log in.",
    });
  }
};

export default authenticateToken;
