export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  eventType: string;
  metadata?: Record<string, unknown>;
}

export interface INotificationStrategy {
  send(payload: NotificationPayload): Promise<void>;
}
