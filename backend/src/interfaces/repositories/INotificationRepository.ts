import { INotification } from '../../models/Notification';

export interface INotificationRepository {
  create(data: Partial<INotification>): Promise<INotification>;
  findById(id: string): Promise<INotification | null>;
  findAll(filter?: Record<string, unknown>): Promise<INotification[]>;
  findByUser(userId: string): Promise<INotification[]>;
  update(id: string, data: Partial<INotification>): Promise<INotification | null>;
  delete(id: string): Promise<void>;
  markAllRead(userId: string): Promise<void>;
}
