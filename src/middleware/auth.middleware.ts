import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { jwtPayload } from '../types';


declare global {
    namespace Express {
        interface Request {
            user?: jwtPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) =>{
      try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer')) {
                   res.status(401).json({message: 'Unauthorized'});
                   return;
            }
            const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET as string;

            const decoded = jwt.verify(token, secret) as jwtPayload;
            req.user = decoded;
            next();
      } catch(error) {
             res.status(401).json({message: 'invalid token '});
      }
}
