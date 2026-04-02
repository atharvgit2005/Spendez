import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';
import { v4 as uuid } from 'uuid';

export const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || uuid();

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success:   false,
      code:      err.code,
      message:   err.message,
      details:   err.details,
      requestId,
    });
    return;
  }

  logger.error('Unhandled error', { err: err.message, stack: err.stack, requestId });
  res.status(500).json({
    success:   false,
    code:      'INTERNAL_ERROR',
    message:   'Something went wrong',
    requestId,
  });
};
