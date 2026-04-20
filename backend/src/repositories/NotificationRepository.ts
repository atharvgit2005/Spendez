import { INotificationRepository } from '../interfaces/repositories/INotificationRepository';
import { Notification, INotification } from '../models/Notification';

export class NotificationRepository implements INotificationRepository {
  async create(data: Partial<INotification>): Promise<INotification> {
    return Notification.create(data);
  }

  async findById(id: string): Promise<INotification | null> {
    return Notification.findById(id);
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<INotification[]> {
    return Notification.find(filter);
  }

  async findByUser(userId: string): Promise<INotification[]> {
    return Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async update(id: string, data: Partial<INotification>): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Notification.findByIdAndDelete(id);
  }

  async markAllRead(userId: string): Promise<void> {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  }
}
