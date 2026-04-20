"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const Notification_1 = require("../models/Notification");
class NotificationRepository {
    async create(data) {
        return Notification_1.Notification.create(data);
    }
    async findById(id) {
        return Notification_1.Notification.findById(id);
    }
    async findAll(filter = {}) {
        return Notification_1.Notification.find(filter);
    }
    async findByUser(userId) {
        return Notification_1.Notification.find({ userId }).sort({ createdAt: -1 });
    }
    async update(id, data) {
        return Notification_1.Notification.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Notification_1.Notification.findByIdAndDelete(id);
    }
    async markAllRead(userId) {
        await Notification_1.Notification.updateMany({ userId, isRead: false }, { isRead: true });
    }
}
exports.NotificationRepository = NotificationRepository;
