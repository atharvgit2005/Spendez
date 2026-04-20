"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
const InAppNotificationStrategy_1 = require("../strategies/notification/InAppNotificationStrategy");
const notificationService = new NotificationService_1.NotificationService(new InAppNotificationStrategy_1.InAppNotificationStrategy());
class NotificationController {
    async getAll(req, res, next) {
        try {
            const notifications = await notificationService.getForUser(req.user.userId);
            res.json({ success: true, data: notifications });
        }
        catch (err) {
            next(err);
        }
    }
    async markRead(req, res, next) {
        try {
            const n = await notificationService.markRead(req.params.id);
            res.json({ success: true, data: n });
        }
        catch (err) {
            next(err);
        }
    }
    async markAllRead(req, res, next) {
        try {
            await notificationService.markAllRead(req.user.userId);
            res.json({ success: true, message: 'All notifications marked as read' });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
