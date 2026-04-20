"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const logger_1 = require("../config/logger");
const authService = new AuthService_1.AuthService();
class AuthController {
    async register(req, res, next) {
        try {
            logger_1.AppLogger.info('Registration attempt:', { email: req.body.email });
            const result = await authService.register(req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (err) {
            logger_1.AppLogger.error('Registration failed:', err);
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            logger_1.AppLogger.info('Login attempt:', { email: req.body.email });
            const result = await authService.login(req.body);
            res.json({ success: true, data: result });
        }
        catch (err) {
            logger_1.AppLogger.error('Login failed:', err);
            next(err);
        }
    }
    async me(req, res, next) {
        try {
            const user = await authService.getCurrentUser(req.user.userId);
            res.json({ success: true, data: user });
        }
        catch (err) {
            next(err);
        }
    }
    async refresh(req, res, next) {
        try {
            const tokens = await authService.refreshTokens(req.body.token);
            res.json({ success: true, data: tokens });
        }
        catch (err) {
            next(err);
        }
    }
    async logout(_req, res) {
        // Stateless JWT — client just discards tokens.
        res.json({ success: true, message: 'Logged out' });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
