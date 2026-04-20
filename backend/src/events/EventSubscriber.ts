import { eventPublisher, Events } from './EventPublisher';
import { NotificationService } from '../services/NotificationService';
import { StrategyFactory } from '../factories/StrategyFactory';
import { AppLogger } from '../config/logger';

export class EventSubscriber {
  static init() {
    const emailStrategy = StrategyFactory.createNotificationStrategy('EMAIL');
    const notificationService = new NotificationService(emailStrategy);

    eventPublisher.on(Events.EXPENSE_CREATED, async (data: { expense: any; groupMembers: string[] }) => {
      try {
        await notificationService.notifyExpenseAdded(data.expense, data.groupMembers);
        AppLogger.info(`[Event] Handled EXPENSE_CREATED for ${data.expense._id}`);
      } catch (err) {
        AppLogger.error(`[Event] Error handling EXPENSE_CREATED`, err);
      }
    });

    eventPublisher.on(Events.PAYMENT_SETTLED, async (data: { payment: any }) => {
      try {
        await notificationService.notifyPaymentReceived(data.payment);
        AppLogger.info(`[Event] Handled PAYMENT_SETTLED for ${data.payment._id}`);
      } catch (err) {
        AppLogger.error(`[Event] Error handling PAYMENT_SETTLED`, err);
      }
    });

    AppLogger.info('Event listeners registered successfully.');
  }
}
