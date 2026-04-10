import { ISplitStrategy, SplitConfig } from '../../interfaces/strategies/ISplitStrategy';
import { DomainError } from '../../errors/AppError';

export class EqualSplitStrategy implements ISplitStrategy {
  calculateShares(
    _expenseId: string,
    amount: number,
    config: SplitConfig
  ) {
    const { participants } = config;
    if (!participants || participants.length === 0) {
      throw new DomainError('SPLIT_ERROR', 'At least one participant is required');
    }

    const share = Math.floor((amount / participants.length) * 100) / 100;
    const totalAssigned = share * participants.length;
    const remainder = Math.round((amount - totalAssigned) * 100) / 100;

    return participants.map((userId, idx) => ({
      userId,
      shareAmount: idx === 0 ? share + remainder : share,
    }));
  }
}
