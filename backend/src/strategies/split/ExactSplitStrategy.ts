import { ISplitStrategy, SplitConfig } from '../../interfaces/strategies/ISplitStrategy';
import { DomainError } from '../../errors/AppError';

export class ExactSplitStrategy implements ISplitStrategy {
  calculateShares(
    _expenseId: string,
    amount: number,
    config: SplitConfig
  ) {
    const { participants, exactAmounts } = config;
    if (!exactAmounts) {
      throw new DomainError('SPLIT_ERROR', 'Exact amounts are required for EXACT split type');
    }

    const total = Object.values(exactAmounts).reduce((sum, a) => sum + a, 0);
    if (Math.abs(total - amount) > 0.01) {
      throw new DomainError('SPLIT_ERROR', `Exact amounts (${total}) must sum to total amount (${amount})`);
    }

    return participants.map((userId) => ({
      userId,
      shareAmount: exactAmounts[userId] ?? 0,
    }));
  }
}
