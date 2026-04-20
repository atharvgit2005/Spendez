import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/AuditService';
import { AuthRequest } from './auth.middleware';
import { v4 as uuid } from 'uuid';

const auditService = new AuditService();

export const auditMiddleware = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  // Only audit mutating operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const requestId = uuid();
    req.headers['x-request-id'] = requestId;

    try {
      await auditService.log({
        actorUserId:  req.user?.userId,
        action:       `${req.method} ${req.path}`,
        resourceType: req.path.split('/')[3] || 'unknown',
        requestId,
        ipAddress:    req.ip,
        metadata:     { body: req.body },
      });
    } catch {
      // Audit failure should not block request
    }
  }
  next();
};
