"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../errors/AppError");
const authMiddleware = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new AppError_1.UnauthorizedError('Missing authorization header'));
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = (0, jwt_1.verifyAccessToken)(token);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (role) => (req, _res, next) => {
    if (req.user?.role !== role) {
        return next(new AppError_1.UnauthorizedError(`Requires role: ${role}`));
    }
    next();
};
exports.requireRole = requireRole;
