"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = exports.AnalyticsController = void 0;
const AnalyticsService_1 = require("../services/AnalyticsService");
const analyticsService = new AnalyticsService_1.AnalyticsService();
class AnalyticsController {
    async getDashboard(req, res, next) {
        try {
            const from = new Date(req.query.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
            const to = new Date(req.query.to || new Date());
            const data = await analyticsService.getDashboard(req.params.id, from, to);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    async getRecurring(req, res, next) {
        try {
            const data = await analyticsService.detectRecurring(req.params.id);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    async getUserSummary(req, res, next) {
        try {
            const from = new Date(req.query.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
            const to = new Date(req.query.to || new Date());
            const data = await analyticsService.getUserSummary(req.user.userId, from, to);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.analyticsController = new AnalyticsController();
