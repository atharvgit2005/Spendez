"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditMiddleware = void 0;
const AuditService_1 = require("../services/AuditService");
const uuid_1 = require("uuid");
const auditService = new AuditService_1.AuditService();
const auditMiddleware = async (req, _res, next) => {
    // Only audit mutating operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const requestId = (0, uuid_1.v4)();
        req.headers['x-request-id'] = requestId;
        try {
            await auditService.log({
                actorUserId: req.user?.userId,
                action: `${req.method} ${req.path}`,
                resourceType: req.path.split('/')[3] || 'unknown',
                requestId,
                ipAddress: req.ip,
                metadata: { body: req.body },
            });
        }
        catch {
            // Audit failure should not block request
        }
    }
    next();
};
exports.auditMiddleware = auditMiddleware;
