import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';

export default function validateObjectId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  next();
}
