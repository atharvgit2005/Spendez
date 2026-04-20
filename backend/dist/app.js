"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const audit_middleware_1 = require("./middleware/audit.middleware");
const db_1 = require("./config/db");
const logger_1 = require("./config/logger");
const createApp = () => {
    const app = (0, express_1.default)();
    // 1. Permissive CORS (Must be first)
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    }));
    // 2. Debug Logging
    app.use((req, _res, next) => {
        logger_1.AppLogger.info(`>>> ${req.method} ${req.url}`);
        next();
    });
    // 3. Security & Parsing
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Logging
    app.use((0, morgan_1.default)('combined', { stream: { write: (msg) => logger_1.AppLogger.info(msg.trim()) } }));
    // Audit middleware (captures request metadata)
    app.use(audit_middleware_1.auditMiddleware);
    // API routes
    app.use('/api/v1', routes_1.default);
    // Global error handler
    app.use(error_middleware_1.errorMiddleware);
    return app;
};
exports.createApp = createApp;
// Initialize DB connection
db_1.Database.connect()
    .catch((err) => logger_1.AppLogger.error('MongoDB initialization failed', err));
