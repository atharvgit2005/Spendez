"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.AppLogger = void 0;
const winston_1 = __importDefault(require("winston"));
class AppLogger {
    static getInstance() {
        if (!AppLogger.instance) {
            AppLogger.instance = winston_1.default.createLogger({
                level: 'info',
                format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`)),
                transports: [
                    new winston_1.default.transports.Console(),
                    new winston_1.default.transports.File({ filename: 'backend.log' })
                ],
            });
        }
        return AppLogger.instance;
    }
    static info(message, meta) {
        this.getInstance().info(message, meta);
    }
    static error(message, meta) {
        this.getInstance().error(message, meta);
    }
    static warn(message, meta) {
        this.getInstance().warn(message, meta);
    }
    static debug(message, meta) {
        this.getInstance().debug(message, meta);
    }
}
exports.AppLogger = AppLogger;
exports.logger = AppLogger.getInstance();
