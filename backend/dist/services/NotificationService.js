"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationRepository_1 = require("../repositories/NotificationRepository");
class NotificationService {
    constructor(strategy) {
        this.strategy = strategy;
        this.notifRepo = new NotificationRepository_1.NotificationRepository();
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    async notify(userId, eventType, title, message) {
        await this.strategy.send({ userId, eventType, title, message });
    }
    async notifyExpenseAdded(expense, memberIds) {
        const others = memberIds.filter((id) => id !== expense._id?.toString());
        await Promise.all(others.map((userId) => this.notify(userId, 'expense.created', 'New Expense Added', `A new expense "${expense.title}" of ₹${expense.amount} was added to your group.`)));
    }
    async notifyPaymentReceived(payment) {
        await this.notify(payment.toUserId, 'payment.settled', 'Payment Received', `You received a payment of ₹${payment.amount}.`);
    }
    async sendBudgetAlert(userId, budget) {
        const pct = Math.round((budget.usedAmount / budget.limitAmount) * 100);
        await this.notify(userId, 'budget.alert', '⚠️ Budget Alert', `You've used ${pct}% of your budget (₹${budget.usedAmount} / ₹${budget.limitAmount}).`);
    }
    async getForUser(userId) {
        return this.notifRepo.findByUser(userId);
    }
    async markRead(id) {
        const n = await this.notifRepo.update(id, { isRead: true });
        return n;
    }
    async markAllRead(userId) {
        await this.notifRepo.markAllRead(userId);
    }
}
exports.NotificationService = NotificationService;
