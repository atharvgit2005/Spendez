import { Expense } from '../models/Expense';

interface DashboardDTO {
  totalSpent: number;
  byCategory: { category: string; amount: number }[];
  byMember: { userId: string; amount: number }[];
  topExpenses: unknown[];
  period: { from: Date; to: Date };
}

interface RecurringExpenseDTO {
  title: string;
  frequency: number;
  avgAmount: number;
  lastDate: Date;
}

export class AnalyticsService {
  async getDashboard(groupId: string, from: Date, to: Date): Promise<DashboardDTO> {
    const [totals, byCategory, byMember, topExpenses] = await Promise.all([
      // Total spent
      Expense.aggregate([
        { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId), expenseDate: { $gte: from, $lte: to } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      // By category
      Expense.aggregate([
        { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId), expenseDate: { $gte: from, $lte: to } } },
        { $group: { _id: '$category', amount: { $sum: '$amount' } } },
        { $project: { _id: 0, category: '$_id', amount: 1 } },
        { $sort: { amount: -1 } },
      ]),

      // By member (paid by)
      Expense.aggregate([
        { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId), expenseDate: { $gte: from, $lte: to } } },
        { $group: { _id: '$paidBy', amount: { $sum: '$amount' } } },
        { $project: { _id: 0, userId: { $toString: '$_id' }, amount: 1 } },
        { $sort: { amount: -1 } },
      ]),

      // Top 5 expenses
      Expense.find({
        groupId,
        expenseDate: { $gte: from, $lte: to },
      })
        .sort({ amount: -1 })
        .limit(5)
        .populate('paidBy', 'name email'),
    ]);

    return {
      totalSpent:  totals[0]?.total ?? 0,
      byCategory,
      byMember,
      topExpenses,
      period: { from, to },
    };
  }

  async detectRecurring(groupId: string): Promise<RecurringExpenseDTO[]> {
    const results = await Expense.aggregate([
      { $match: { groupId: new (require('mongoose').Types.ObjectId)(groupId) } },
      {
        $group: {
          _id:      '$title',
          count:    { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          lastDate:  { $max: '$expenseDate' },
        },
      },
      { $match: { count: { $gte: 2 } } },
      {
        $project: {
          _id: 0,
          title:     '$_id',
          frequency: '$count',
          avgAmount: 1,
          lastDate:  1,
        },
      },
      { $sort: { frequency: -1 } },
    ]);

    return results as RecurringExpenseDTO[];
  }

  async getUserSummary(userId: string, from: Date, to: Date) {
    const [totalPaid, byCategory] = await Promise.all([
      Expense.aggregate([
        { $match: { paidBy: new (require('mongoose').Types.ObjectId)(userId), expenseDate: { $gte: from, $lte: to } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
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
