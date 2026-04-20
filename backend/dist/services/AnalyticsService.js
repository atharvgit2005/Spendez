"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const Expense_1 = require("../models/Expense");
class AnalyticsService {
    async getDashboard(groupId, from, to) {
        const [totals, byCategory, byMember, topExpenses] = await Promise.all([
            // Total spent
            Expense_1.Expense.aggregate([
                { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId), expenseDate: { $gte: from, $lte: to } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // By category
            Expense_1.Expense.aggregate([
                { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId), expenseDate: { $gte: from, $lte: to } } },
                { $group: { _id: '$category', amount: { $sum: '$amount' } } },
                { $project: { _id: 0, category: '$_id', amount: 1 } },
                { $sort: { amount: -1 } },
            ]),
            // By member (paid by)
            Expense_1.Expense.aggregate([
                { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId), expenseDate: { $gte: from, $lte: to } } },
                { $group: { _id: '$paidBy', amount: { $sum: '$amount' } } },
                { $project: { _id: 0, userId: { $toString: '$_id' }, amount: 1 } },
                { $sort: { amount: -1 } },
            ]),
            // Top 5 expenses
            Expense_1.Expense.find({
                groupId,
                expenseDate: { $gte: from, $lte: to },
            })
                .sort({ amount: -1 })
                .limit(5)
                .populate('paidBy', 'name email'),
        ]);
        return {
            totalSpent: totals[0]?.total ?? 0,
            byCategory,
            byMember,
            topExpenses,
            period: { from, to },
        };
    }
    async detectRecurring(groupId) {
        const results = await Expense_1.Expense.aggregate([
            { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId) } },
            {
                $group: {
                    _id: '$title',
                    count: { $sum: 1 },
                    avgAmount: { $avg: '$amount' },
                    lastDate: { $max: '$expenseDate' },
                },
            },
            { $match: { count: { $gte: 2 } } },
            {
                $project: {
                    _id: 0,
                    title: '$_id',
                    frequency: '$count',
                    avgAmount: 1,
                    lastDate: 1,
                },
            },
            { $sort: { frequency: -1 } },
        ]);
        return results;
    }
    async getUserSummary(userId, from, to) {
        const [totalPaid, byCategory] = await Promise.all([
            Expense_1.Expense.aggregate([
                { $match: { paidBy: new (require('mongoose').Types.ObjectId)(userId), expenseDate: { $gte: from, $lte: to } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            Expense_1.Expense.aggregate([
                { $match: { paidBy: new (require('mongoose').Types.ObjectId)(userId), expenseDate: { $gte: from, $lte: to } } },
                { $group: { _id: '$category', amount: { $sum: '$amount' } } },
                { $project: { _id: 0, category: '$_id', amount: 1 } },
            ]),
        ]);
        return {
            totalPaid: totalPaid[0]?.total ?? 0,
            byCategory,
            period: { from, to },
        };
    }
}
exports.AnalyticsService = AnalyticsService;
