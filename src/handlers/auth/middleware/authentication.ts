import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../../../dtos/types';
import { getUserByUsername } from '../../../helpers/api';

const secretKey = '7624API1!@';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')?.[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    try {
        const data = jwt.verify(token, secretKey) as jwt.JwtPayload;
        const username = data.data as string;
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'User not found', status: 0, data: null });
        }
        (req as IGetUserAuthInfoRequest).user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export const createToken = (data: string) => jwt.sign({ data, timeStamp: Date.now() }, secretKey);
