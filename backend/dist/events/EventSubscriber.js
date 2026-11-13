"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubscriber = void 0;
const EventPublisher_1 = require("./EventPublisher");
const NotificationService_1 = require("../services/NotificationService");
const StrategyFactory_1 = require("../factories/StrategyFactory");
const logger_1 = require("../config/logger");
class EventSubscriber {
    static init() {
        const emailStrategy = StrategyFactory_1.StrategyFactory.createNotificationStrategy('EMAIL');
        const notificationService = new NotificationService_1.NotificationService(emailStrategy);
        EventPublisher_1.eventPublisher.on(EventPublisher_1.Events.EXPENSE_CREATED, async (data) => {
            try {
                await notificationService.notifyExpenseAdded(data.expense, data.groupMembers);
                logger_1.AppLogger.info(`[Event] Handled EXPENSE_CREATED for ${data.expense._id}`);
            }
            catch (err) {
                logger_1.AppLogger.error(`[Event] Error handling EXPENSE_CREATED`, err);
            }
        });
        EventPublisher_1.eventPublisher.on(EventPublisher_1.Events.PAYMENT_SETTLED, async (data) => {
            try {
                await notificationService.notifyPaymentReceived(data.payment);
                logger_1.AppLogger.info(`[Event] Handled PAYMENT_SETTLED for ${data.payment._id}`);
            }
            catch (err) {
                logger_1.AppLogger.error(`[Event] Error handling PAYMENT_SETTLED`, err);
            }
        });
        logger_1.AppLogger.info('Event listeners registered successfully.');
    }
}
exports.EventSubscriber = EventSubscriber;
