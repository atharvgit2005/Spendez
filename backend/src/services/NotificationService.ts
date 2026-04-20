import { INotificationStrategy } from '../interfaces/strategies/INotificationStrategy';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { INotification } from '../models/Notification';

export class NotificationService {
  private notifRepo = new NotificationRepository();

  constructor(private strategy: INotificationStrategy) {}

  setStrategy(strategy: INotificationStrategy): void {
    this.strategy = strategy;
  }

  async notify(
    userId: string,
    eventType: string,
    title: string,
    message: string
  ): Promise<void> {
    await this.strategy.send({ userId, eventType, title, message });
  }

  async notifyExpenseAdded(expense: { _id: unknown; title: string; amount: number }, memberIds: string[]): Promise<void> {
    const others = memberIds.filter((id) => id !== expense._id?.toString());
    await Promise.all(
      others.map((userId) =>
        this.notify(
          userId,
          'expense.created',
          'New Expense Added',
          `A new expense "${expense.title}" of ₹${expense.amount} was added to your group.`
        )
      )
    );
  }

  async notifyPaymentReceived(payment: { toUserId: unknown; amount: number }): Promise<void> {
    await this.notify(
      payment.toUserId as string,
      'payment.settled',
      'Payment Received',
      `You received a payment of ₹${payment.amount}.`
    );
  }

  async sendBudgetAlert(userId: string, budget: { limitAmount: number; usedAmount: number }): Promise<void> {
    const pct = Math.round((budget.usedAmount / budget.limitAmount) * 100);
    await this.notify(
      userId,
      'budget.alert',
      '⚠️ Budget Alert',
      `You've used ${pct}% of your budget (₹${budget.usedAmount} / ₹${budget.limitAmount}).`
    );
  }

  async getForUser(userId: string): Promise<INotification[]> {
    return this.notifRepo.findByUser(userId);
  }

  async markRead(id: string): Promise<INotification> {
    const n = await this.notifRepo.update(id, { isRead: true });
    return n!;
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notifRepo.markAllRead(userId);
  }
}
