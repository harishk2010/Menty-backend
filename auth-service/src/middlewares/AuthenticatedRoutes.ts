import { NextFunction, Request, Response } from "express";
import { JwtService } from "../utils/jwt"; // Adjust path accordingly
import { TokenExpiredError } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
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
): Promise<void> => {
  console.log("Auth middleware entered");

  const accessToken = req.headers["authorization"]?.split(" ")[1]; // Expecting format: 'Bearer <token>'
  const refreshToken = req.headers["x-refresh-token"] as string | undefined;
  
  console.log("Access Token from Headers:", accessToken);
  console.log("Refresh Token from Headers:", refreshToken);

  if (!accessToken) {
    return handleTokenRefresh(req, res, next, refreshToken);
  }

  try {
    const accessPayload = await jwtService.verifyToken(accessToken);
    req.user = accessPayload;
    console.log("Access token verified successfully.");
    return next();
  } catch (error: any) {
    console.log("Access token verification failed:", error);

    if (error instanceof TokenExpiredError) {
      return handleTokenRefresh(req, res, next, refreshToken);
    }

    res.status(401).json({ message: "Invalid access token. Please log in." });
  }
};

const handleTokenRefresh = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
  refreshToken?: string
): Promise<void> => {
  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided. Please log in." });
    return;
  }

  try {
    const refreshPayload = await jwtService.verifyToken(refreshToken);
    console.log("Refresh token verified:", refreshPayload);

    const newAccessToken = await jwtService.accessToken({
      email: refreshPayload.email,
      role: refreshPayload.role,
    });

    console.log("Generated new access token:", newAccessToken);

    // Send new access token in response headers instead of cookies
    res.setHeader("x-access-token", newAccessToken);

    req.user = refreshPayload;
    return next();
  } catch (refreshErr: any) {
    console.error("Error verifying refresh token:", refreshErr);
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
};

export default authenticateToken;
