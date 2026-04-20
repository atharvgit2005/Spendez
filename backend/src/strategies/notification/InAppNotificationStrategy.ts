import { INotificationStrategy, NotificationPayload } from '../../interfaces/strategies/INotificationStrategy';
import { Notification } from '../../models/Notification';
import { logger } from '../../config/logger';

export class InAppNotificationStrategy implements INotificationStrategy {
  async send(payload: NotificationPayload): Promise<void> {
    try {
      await Notification.create({
        userId:         payload.userId,
        eventType:      payload.eventType,
        channel:        'IN_APP',
        title:          payload.title,
        message:        payload.message,
        deliveryStatus: 'SENT',
        sentAt:         new Date(),
      });
      logger.info(`In-app notification sent to ${payload.userId}`);
    } catch (err) {
      logger.error('Failed to create in-app notification', { err });
    }
  }
}
