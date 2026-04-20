"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotificationStrategy = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Notification_1 = require("../../models/Notification");
const User_1 = require("../../models/User");
const env_1 = require("../../config/env");
const logger_1 = require("../../config/logger");
class EmailNotificationStrategy {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: env_1.env.EMAIL_HOST,
            port: parseInt(env_1.env.EMAIL_PORT, 10),
            secure: false,
            auth: {
                user: env_1.env.EMAIL_USER,
                pass: env_1.env.EMAIL_PASS,
            },
        });
    }
    async send(payload) {
        const user = await User_1.User.findById(payload.userId);
        if (!user)
            return;
        try {
            await this.transporter.sendMail({
                from: `"Spendez" <${env_1.env.EMAIL_USER}>`,
                to: user.email,
                subject: payload.title,
                html: `<p>${payload.message}</p>`,
            });
            await Notification_1.Notification.create({
                userId: payload.userId,
                eventType: payload.eventType,
                channel: 'EMAIL',
                title: payload.title,
                message: payload.message,
                deliveryStatus: 'SENT',
                sentAt: new Date(),
            });
            logger_1.logger.info(`Email notification sent to ${user.email}`);
        }
        catch (err) {
            logger_1.logger.error('Failed to send email notification', { err });
            await Notification_1.Notification.create({
                userId: payload.userId,
                eventType: payload.eventType,
                channel: 'EMAIL',
                title: payload.title,
                message: payload.message,
                deliveryStatus: 'FAILED',
            });
        }
    }
}
exports.EmailNotificationStrategy = EmailNotificationStrategy;
