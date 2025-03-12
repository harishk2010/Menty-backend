
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
config();
import { accessToken } from '../utils/jwt';
import { AuthErrorMsg } from '../utils/constants';
import { StatusCode } from '../utils/enums';

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

    const theAccessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

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

        
            try {
            
                const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as AuthenticatedRequest['user'];
                if (!refreshPayload) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_REFRESH_TOKEN });
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
                   
                });

                // Update req.cookies with the new access token
                req.cookies['accessToken'] = newAccessToken;

                // Attach payload to request
                req.user = refreshPayload;
                return next();
            } catch (refreshErr: any) {
                if (refreshErr.name === AuthErrorMsg.TOKEN_EXPIRED_NAME) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_REFRESH_TOKEN });
                }

                return res.status(StatusCode.UNAUTHORIZED).json({ message: AuthErrorMsg.INVALID_REFRESH_TOKEN });
            }
        }

        return res.status(StatusCode.BAD_REQUEST).json({ message: AuthErrorMsg.INVALID_ACCESS_TOKEN });
    }
};

export default authenticateToken;
