import { ISplitRepository } from '../interfaces/repositories/ISplitRepository';
import { Split, ISplit } from '../models/Split';

export class SplitRepository implements ISplitRepository {
  async create(data: Partial<ISplit>): Promise<ISplit> {
    return Split.create(data);
  }

  async findById(id: string): Promise<ISplit | null> {
    return Split.findById(id).populate('userId', 'name email avatarUrl');
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<ISplit[]> {
    return Split.find(filter);
  }

  async findByExpense(expenseId: string): Promise<ISplit[]> {
    return Split.find({ expenseId }).populate('userId', 'name email avatarUrl');
  }

  async update(id: string, data: Partial<ISplit>): Promise<ISplit | null> {
    return Split.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Split.findByIdAndDelete(id);
  }

  async insertMany(splits: Partial<ISplit>[]): Promise<ISplit[]> {
    return Split.insertMany(splits) as unknown as Promise<ISplit[]>;
  }

  async deleteByExpense(expenseId: string): Promise<void> {
    await Split.deleteMany({ expenseId });
  }

  async calculateGroupBalances(groupId: import('mongoose').Types.ObjectId): Promise<any[]> {
    return Split.aggregate([
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
