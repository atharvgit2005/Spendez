"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = require("mongoose");
const PaymentRepository_1 = require("../repositories/PaymentRepository");
const AppError_1 = require("../errors/AppError");
const EventPublisher_1 = require("../events/EventPublisher");
const debtSimplifier_1 = require("../utils/debtSimplifier");
const SplitRepository_1 = require("../repositories/SplitRepository");
class PaymentService {
    constructor() {
        this.paymentRepo = new PaymentRepository_1.PaymentRepository();
        this.splitRepo = new SplitRepository_1.SplitRepository();
    }
    async createPayment(dto) {
        const payment = await this.paymentRepo.create({
            ...dto,
            groupId: new mongoose_1.Types.ObjectId(dto.groupId),
            fromUserId: new mongoose_1.Types.ObjectId(dto.fromUserId),
            toUserId: new mongoose_1.Types.ObjectId(dto.toUserId),
            status: 'PENDING',
        });
        EventPublisher_1.eventPublisher.emit(EventPublisher_1.Events.PAYMENT_SETTLED, { payment });
        return payment;
    }
    async getGroupPayments(groupId) {
        return this.paymentRepo.findByGroup(groupId);
    }
    async updateStatus(id, status) {
        const payment = await this.paymentRepo.update(id, {
            status,
            ...(status === 'COMPLETED' ? { paidAt: new Date() } : {}),
        });
        if (!payment)
            throw new AppError_1.NotFoundError('Payment', id);
        return payment;
    }
    async getGroupBalances(groupId) {
        const gid = new mongoose_1.Types.ObjectId(groupId);
        // Aggregation pipeline to calculate net balances including expenses and settlements
        const results = await this.splitRepo.calculateGroupBalances(gid);
        const balanceMap = {};
        const f = results[0];
        // 1. Apply Debts (what you owe based on your share)
        f.debts.forEach((d) => {
            const uid = d._id.toString();
            balanceMap[uid] = (balanceMap[uid] || 0) - d.totalDebt;
        });
        // 2. Apply Credits (what people owe you because you paid for them)
        f.credits.forEach((c) => {
            const uid = c._id.toString();
            balanceMap[uid] = (balanceMap[uid] || 0) + c.totalCredit;
        });
        // 3. Apply Payments Out (money you sent to others - increases your balance as you owe less)
        f.paymentsOut?.forEach((p) => {
            const uid = p._id.toString();
            balanceMap[uid] = (balanceMap[uid] || 0) + p.totalPaid;
        });
        // 4. Apply Payments In (money you received - decreases your balance as they owe you less)
        f.paymentsIn?.forEach((p) => {
            const uid = p._id.toString();
            balanceMap[uid] = (balanceMap[uid] || 0) - p.totalReceived;
        });
        return Object.entries(balanceMap).map(([userId, net]) => ({
            userId,
            net: Math.round(net * 100) / 100
        }));
    }
    async getSimplifiedDebts(groupId) {
        const balances = await this.getGroupBalances(groupId);
        const rawDebts = [];
        // Convert negative balances (debtors) into raw debts pointing to positive (creditors)
        const creditors = balances.filter((b) => b.net > 0);
        const debtors = balances.filter((b) => b.net < 0);
        for (const debtor of debtors) {
            for (const creditor of creditors) {
                rawDebts.push({ from: debtor.userId, to: creditor.userId, amount: Math.abs(debtor.net) });
            }
        }
        return (0, debtSimplifier_1.simplifyDebts)(rawDebts);
    }
}
exports.PaymentService = PaymentService;
