
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
config();
import { accessToken } from '../utils/jwt';
import { StatusCode } from '../utils/enums';
import { AuthErrorMsg } from '../utils/constants';

const JWT_SECRET = process.env.JWT_SECRET as string || "Sombu"

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

    const theAccessToken = req.cookies['accessToken'];
    console.log(theAccessToken)
    const refreshToken = req.cookies['refreshToken'];
    console.log(refreshToken)

    if (!theAccessToken) {
        return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: AuthErrorMsg.NO_ACCESS_TOKEN });
    }

    try {
        
        const accessPayload = jwt.verify(theAccessToken, JWT_SECRET) as AuthenticatedRequest['user'];

        
        req.user = accessPayload;
        return next();
    } catch (err: any) {
        if (err.name === AuthErrorMsg.TOKEN_EXPIRED_NAME) {

            if (!refreshToken) {
                return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: AuthErrorMsg.NO_REFRESH_TOKEN });
            }

            // Verify Refresh Token
            try {
                // const jwtt=new JwtService()
                const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as AuthenticatedRequest['user'];
                if (!refreshPayload) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
                }

                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                if (refreshPayload.exp && refreshPayload.exp < currentTime) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.REFRESH_TOKEN_EXPIRED });
                }


                             
                const newAccessToken =await accessToken(
                    {email:refreshPayload.email, role: refreshPayload.role },
                );

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
                });

                // Update req.cookies with the new access token
                req.cookies['accessToken'] = newAccessToken;

                // Attach payload to request
                req.user = refreshPayload;
                return next();
            } catch (refreshErr: any) {
                if (refreshErr.name === AuthErrorMsg.TOKEN_EXPIRED_NAME) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.REFRESH_TOKEN_EXPIRED });
                }

                return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_REFRESH_TOKEN });
            }
        }

        return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
    }
};

export default authenticateToken;
