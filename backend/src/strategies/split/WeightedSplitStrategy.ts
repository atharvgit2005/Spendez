import { ISplitStrategy, SplitConfig } from '../../interfaces/strategies/ISplitStrategy';
import { DomainError } from '../../errors/AppError';

export class WeightedSplitStrategy implements ISplitStrategy {
  calculateShares(
    _expenseId: string,
    amount: number,
    config: SplitConfig
  ) {
    const { participants, weights } = config;
    if (!weights) {
      throw new DomainError('SPLIT_ERROR', 'Weights are required for WEIGHTED split type');
    }

    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) {
      throw new DomainError('SPLIT_ERROR', 'Total weight must be positive');
    }

    return participants.map((userId) => {
      const weight = weights[userId] ?? 0;
      return {
        userId,
        shareAmount: Math.round((weight / totalWeight) * amount * 100) / 100,
        weight,
      };
    });
  }
}
