import type { Request, Response, NextFunction } from 'express';

export default function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error('Unhandled Error:', err.message);

  res.status(500).send('Something failed.');
}
