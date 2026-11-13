"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRepository = void 0;
const Split_1 = require("../models/Split");
class SplitRepository {
    async create(data) {
        return Split_1.Split.create(data);
    }
    async findById(id) {
        return Split_1.Split.findById(id).populate('userId', 'name email avatarUrl');
    }
    async findAll(filter = {}) {
        return Split_1.Split.find(filter);
    }
    async findByExpense(expenseId) {
        return Split_1.Split.find({ expenseId }).populate('userId', 'name email avatarUrl');
    }
    async update(id, data) {
        return Split_1.Split.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Split_1.Split.findByIdAndDelete(id);
    }
    async insertMany(splits) {
        return Split_1.Split.insertMany(splits);
    }
    async deleteByExpense(expenseId) {
        await Split_1.Split.deleteMany({ expenseId });
    }
    async calculateGroupBalances(groupId) {
        return Split_1.Split.aggregate([
            {
                $lookup: {
                    from: 'expenses',
                    localField: 'expenseId',
                    foreignField: '_id',
                    as: 'expense',
                },
            },
            { $unwind: '$expense' },
            { $match: { 'expense.groupId': groupId } },
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
                                    { $match: { groupId, status: 'COMPLETED' } },
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
                                    { $match: { groupId, status: 'COMPLETED' } },
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
    }
}
exports.SplitRepository = SplitRepository;
