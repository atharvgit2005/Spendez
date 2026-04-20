import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/errorCodes';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        const details = result.error.issues.map((e) => ({
          field:   e.path.join('.'),
          message: e.message,
        }));
        return next(new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Validation failed', details));
      }
      req[source] = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
