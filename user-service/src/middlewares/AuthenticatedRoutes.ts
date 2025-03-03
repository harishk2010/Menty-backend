
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
config();
import { accessToken } from '../utils/jwt';

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
    // console.log('Auth middleware entered');

    const theAccessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    // console.log('Cookies received:', req.cookies);
    // console.log('accessToken:', theAccessToken);

    if (!theAccessToken) {
        return res.status(401).json({ failToken: true, message: 'No access token provided' });
    }

    try {
        
        const accessPayload = jwt.verify(theAccessToken, JWT_SECRET) as AuthenticatedRequest['user'];
        // console.log('Access token verified:', accessPayload);

        
        req.user = accessPayload;
        return next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.log('Access token expired');

            if (!refreshToken) {
                console.log('No refresh token provided');
                return res.status(401).json({ failToken: true, message: 'No refresh token provided' });
            }

            // Verify Refresh Token
            try {
                // const jwtt=new JwtService()
                const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as AuthenticatedRequest['user'];
                if (!refreshPayload) {
                    return res.status(401).json({ message: 'Invalid refresh token. Please log in.' });
                }

                // Check if the refresh token is expired
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                if (refreshPayload.exp && refreshPayload.exp < currentTime) {
                    console.log('Refresh token expired');
                    return res.status(401).json({ message: 'Session expired. Please log in again.' });
                }

                // console.log('Refresh token verified:', refreshPayload);

                             
                const newAccessToken =await accessToken(
                    {email:refreshPayload.email, role: refreshPayload.role },
                );
                // console.log('New access token generated:', newAccessToken);

                // Set new Access Token in cookies
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
                if (refreshErr.name === 'TokenExpiredError') {
                    console.log('Refresh token expired');
                    return res.status(401).json({ message: 'Session expired. Please log in again.' });
                }

                // console.log('Invalid refresh token:', refreshErr.message);
                return res.status(401).json({ message: 'Invalid refresh token. Please log in.' });
            }
        }

        // console.log('Invalid access token:', err.message);
        return res.status(400).json({ message: 'Invalid access token. Please log in.' });
    }
};

export default authenticateToken;
// export default authenticateToken;