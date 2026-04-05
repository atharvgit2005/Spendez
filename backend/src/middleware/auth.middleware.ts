import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors/AppError';

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (role: string) => (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== role) {
    return next(new UnauthorizedError(`Requires role: ${role}`));
  }
  next();
};
