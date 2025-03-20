
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../utils/jwt';
import { AuthErrorMsg } from '../utils/constants';
import { StatusCode } from '../utils/enums';
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}
const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
    user?: {
        user: string;
        email:string;
        role: string;
        iat: number;
        exp: number;
    };
}


const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    

    if (!accessToken) {
        return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: AuthErrorMsg.NO_ACCESS_TOKEN  });
    }

    try {
        // Verify Access Token
        const accessPayload = jwt.verify(accessToken, JWT_SECRET) as AuthenticatedRequest['user'];

        // If valid, attach payload to request and proceed
        req.user = accessPayload;
        return next();
    } catch (err: any) {
        if (err.name === AuthErrorMsg.TOKEN_EXPIRED_NAME) {

            if (!refreshToken) {
                return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: AuthErrorMsg.NO_REFRESH_TOKEN });
            }

            // Verify Refresh Token
            try {
                const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as AuthenticatedRequest['user'];
                if (!refreshPayload) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_REFRESH_TOKEN });
                }

                // Check if the refresh token is expired
                const currentTime = Math.floor(Date.now() / 1000); 
                if (refreshPayload.exp && refreshPayload.exp < currentTime) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.REFRESH_TOKEN_EXPIRED });
                }


                // Generate a new Access Token
                const jwtt=new JwtService()
                const newAccessToken =await jwtt.accessToken(
                    {email:refreshPayload.email, role: refreshPayload.role },
                   
                );

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                  
                });

                
                req.cookies['accessToken'] = newAccessToken;

               
                req.user = refreshPayload;
                return next();
            } catch (refreshErr: any) {
                if (refreshErr.name === AuthErrorMsg.TOKEN_EXPIRED_NAME) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.REFRESH_TOKEN_EXPIRED });
                }

                return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
            }
        }

        return res.status(StatusCode.BAD_REQUEST).json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
    }
};

export default authenticateToken;
