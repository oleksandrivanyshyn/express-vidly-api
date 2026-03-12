import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';

export default function admin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user?.isAdmin) return res.status(403).send('Access denied.');

  next();
}
