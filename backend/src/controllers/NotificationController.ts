import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from '../services/NotificationService';
import { InAppNotificationStrategy } from '../strategies/notification/InAppNotificationStrategy';

const notificationService = new NotificationService(new InAppNotificationStrategy());

export class NotificationController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await notificationService.getForUser(req.user!.userId);
      res.json({ success: true, data: notifications });
    } catch (err) { next(err); }
  }

  async markRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const n = await notificationService.markRead(req.params.id as string);
      res.json({ success: true, data: n });
    } catch (err) { next(err); }
  }

  async markAllRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.markAllRead(req.user!.userId);
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) { next(err); }
  }
}

export const notificationController = new NotificationController();
