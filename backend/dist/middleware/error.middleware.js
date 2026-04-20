"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("../errors/AppError");
const logger_1 = require("../config/logger");
const uuid_1 = require("uuid");
const errorMiddleware = (err, req, res, _next) => {
    const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            code: err.code,
            message: err.message,
            details: err.details,
            requestId,
        });
        return;
    }
    logger_1.logger.error('Unhandled error', { err: err.message, stack: err.stack, requestId });
    res.status(500).json({
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong',
        requestId,
    });
};
exports.errorMiddleware = errorMiddleware;
