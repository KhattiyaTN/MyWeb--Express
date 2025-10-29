import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/jwt_type';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const [ schema, token ] = authHeader.split(' ');
    const secret = process.env.JWT_SECRET;

    if (!authHeader || schema !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!secret) {
        return res.status(500).json({ message: 'Server misconfigured' });
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}