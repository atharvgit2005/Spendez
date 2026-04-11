import { ISplitStrategy, SplitConfig } from '../../interfaces/strategies/ISplitStrategy';
import { DomainError } from '../../errors/AppError';

export class PercentageSplitStrategy implements ISplitStrategy {
  calculateShares(
    _expenseId: string,
    amount: number,
    config: SplitConfig
  ) {
    const { participants, percentages } = config;
    if (!percentages) {
      throw new DomainError('SPLIT_ERROR', 'Percentages are required for PERCENTAGE split type');
    }

    const total = Object.values(percentages).reduce((sum, p) => sum + p, 0);
    if (Math.abs(total - 100) > 0.01) {
      throw new DomainError('PERCENTAGE_MISMATCH', `Percentages must sum to 100, got ${total}`);
    }

    return participants.map((userId) => {
      const pct = percentages[userId] ?? 0;
      return {
        userId,
        shareAmount: Math.round((pct / 100) * amount * 100) / 100,
        percentage: pct,
      };
    });
  }
}
