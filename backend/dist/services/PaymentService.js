"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = require("mongoose");
const PaymentRepository_1 = require("../repositories/PaymentRepository");
const AppError_1 = require("../errors/AppError");
const EventPublisher_1 = require("../events/EventPublisher");
const debtSimplifier_1 = require("../utils/debtSimplifier");
const Split_1 = require("../models/Split");
class PaymentService {
    constructor() {
        this.paymentRepo = new PaymentRepository_1.PaymentRepository();
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
        const results = await Split_1.Split.aggregate([
            // 1. Join with Expenses to filter by GroupId
            {
                $lookup: {
                    from: 'expenses',
                    localField: 'expenseId',
                    foreignField: '_id',
                    as: 'expense',
                },
            },
            { $unwind: '$expense' },
            { $match: { 'expense.groupId': gid } },
            // 2. Separate debts (what participants owe) and credits (what payers are owed)
            {
                $facet: {
                    debts: [
                        { $group: { _id: '$userId', totalDebt: { $sum: '$shareAmount' } } }
                    ],
                    credits: [
                        { $group: { _id: '$expense.paidBy', totalCredit: { $sum: '$shareAmount' } } }
                    ],
                    paymentsOut: [
                        {
                            $lookup: {
                                from: 'payments',
                                pipeline: [
                                    { $match: { groupId: gid, status: 'COMPLETED' } },
                                    { $group: { _id: '$fromUserId', amount: { $sum: '$amount' } } }
                                ],
                                as: 'pOut'
                            }
                        },
                        { $unwind: '$pOut' },
                        { $group: { _id: '$pOut._id', totalPaid: { $first: '$pOut.amount' } } }
                    ],
                    paymentsIn: [
                        {
                            $lookup: {
                                from: 'payments',
                                pipeline: [
                                    { $match: { groupId: gid, status: 'COMPLETED' } },
                                    { $group: { _id: '$toUserId', amount: { $sum: '$amount' } } }
                                ],
                                as: 'pIn'
                            }
                        },
                        { $unwind: '$pIn' },
                        { $group: { _id: '$pIn._id', totalReceived: { $first: '$pIn.amount' } } }
                    ]
                }
            }
        ]);
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
