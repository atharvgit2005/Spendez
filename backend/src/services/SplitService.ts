import { SplitRepository } from '../repositories/SplitRepository';
import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { StrategyFactory, SplitConfig } from '../factories/StrategyFactory';
import { SplitContext } from '../strategies/split/SplitContext';
import { ISplit } from '../models/Split';
import { NotFoundError, DomainError } from '../errors/AppError';

export class SplitService {
  private splitRepo   = new SplitRepository();
  private expenseRepo = new ExpenseRepository();

  async applySplit(expenseId: string, config: SplitConfig): Promise<ISplit[]> {
    const expense = await this.expenseRepo.findById(expenseId);
    if (!expense) throw new NotFoundError('Expense', expenseId);

    const strategy = StrategyFactory.createSplitStrategy(expense.splitType as 'EQUAL' | 'PERCENTAGE' | 'WEIGHTED' | 'EXACT');
    const context  = new SplitContext();
    context.setStrategy(strategy);

    const shares = context.execute(expenseId, expense.amount, config);

    // Delete existing splits for this expense before saving new ones
    await this.splitRepo.deleteByExpense(expenseId);

    const splits = await this.splitRepo.insertMany(
      shares.map((share) => ({
        expenseId: expenseId as unknown as import('mongoose').Types.ObjectId,
        userId:    share.userId as unknown as import('mongoose').Types.ObjectId,
        shareAmount: share.shareAmount,
        percentage:  share.percentage,
        weight:      share.weight,
        status:      'PENDING',
      }))
    );

    return splits;
  }

  async getSplitsForExpense(expenseId: string): Promise<ISplit[]> {
    return this.splitRepo.findByExpense(expenseId);
  }

  async settleUserSplit(splitId: string): Promise<ISplit> {
    const split = await this.splitRepo.findById(splitId);
    if (!split) throw new NotFoundError('Split', splitId);
    if (split.status === 'SETTLED') {
      throw new DomainError('ALREADY_SETTLED', 'This split is already settled');
    }
    const updated = await this.splitRepo.update(splitId, { status: 'SETTLED', settledAt: new Date() });
    return updated!;
  }
}
