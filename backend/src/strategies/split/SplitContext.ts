import { ISplitStrategy, SplitConfig } from '../../interfaces/strategies/ISplitStrategy';

export class SplitContext {
  private strategy!: ISplitStrategy;

  setStrategy(strategy: ISplitStrategy): void {
    this.strategy = strategy;
  }

  execute(
    expenseId: string,
    amount: number,
    config: SplitConfig
  ) {
    if (!this.strategy) {
      throw new Error('No split strategy has been set');
    }
    return this.strategy.calculateShares(expenseId, amount, config);
  }
}
