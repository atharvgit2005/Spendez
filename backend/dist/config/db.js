"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
const env_1 = require("./env");
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    static async connect() {
        const inst = this.getInstance();
        if (inst.isConnected)
            return;
        try {
            await mongoose_1.default.connect(env_1.env.MONGODB_URI);
            inst.isConnected = true;
            logger_1.AppLogger.info('MongoDB connected');
        }
        catch (err) {
            logger_1.AppLogger.error('MongoDB connection error', err);
            throw err;
        }
    }
    static async disconnect() {
        const inst = this.getInstance();
        if (!inst.isConnected)
            return;
        await mongoose_1.default.disconnect();
        inst.isConnected = false;
        logger_1.AppLogger.info('MongoDB disconnected');
    }
}
exports.Database = Database;
exports.db = Database.getInstance();
