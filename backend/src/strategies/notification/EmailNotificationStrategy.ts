import nodemailer from 'nodemailer';
import { INotificationStrategy, NotificationPayload } from '../../interfaces/strategies/INotificationStrategy';
import { Notification } from '../../models/Notification';
import { User } from '../../models/User';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export class EmailNotificationStrategy implements INotificationStrategy {
  private transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  async send(payload: NotificationPayload): Promise<void> {
    const user = await User.findById(payload.userId);
    if (!user) return;

    try {
      await this.transporter.sendMail({
        from:    `"Spendez" <${env.EMAIL_USER}>`,
        to:      user.email,
        subject: payload.title,
        html:    `<p>${payload.message}</p>`,
      });

      await Notification.create({
        userId:         payload.userId,
        eventType:      payload.eventType,
        channel:        'EMAIL',
        title:          payload.title,
        message:        payload.message,
        deliveryStatus: 'SENT',
        sentAt:         new Date(),
      });
      logger.info(`Email notification sent to ${user.email}`);
    } catch (err) {
      logger.error('Failed to send email notification', { err });
      await Notification.create({
        userId:         payload.userId,
        eventType:      payload.eventType,
        channel:        'EMAIL',
        title:          payload.title,
        message:        payload.message,
        deliveryStatus: 'FAILED',
      });
    }
  }
}
