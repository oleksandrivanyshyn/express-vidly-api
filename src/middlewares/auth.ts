import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    isAdmin: boolean;
  };
}

export default function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!) as any;
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
