import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload extends jwt.JwtPayload {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json({error: "Access denied, no token provided"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({error: "Invalid token"});
  }
};