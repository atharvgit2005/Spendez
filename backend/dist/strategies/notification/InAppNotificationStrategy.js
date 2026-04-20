"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppNotificationStrategy = void 0;
const Notification_1 = require("../../models/Notification");
const logger_1 = require("../../config/logger");
class InAppNotificationStrategy {
    async send(payload) {
        try {
            await Notification_1.Notification.create({
                userId: payload.userId,
                eventType: payload.eventType,
                channel: 'IN_APP',
                title: payload.title,
                message: payload.message,
                deliveryStatus: 'SENT',
                sentAt: new Date(),
            });
            logger_1.logger.info(`In-app notification sent to ${payload.userId}`);
        }
        catch (err) {
            logger_1.logger.error('Failed to create in-app notification', { err });
        }
    }
}
exports.InAppNotificationStrategy = InAppNotificationStrategy;
