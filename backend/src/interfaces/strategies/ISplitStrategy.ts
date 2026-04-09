export interface SplitConfig {
  participants: string[]; // user IDs
  percentages?: Record<string, number>;
  weights?: Record<string, number>;
  exactAmounts?: Record<string, number>;
}

export interface ISplitStrategy {
  calculateShares(
    expenseId: string,
    amount: number,
    config: SplitConfig
  ): Array<{
    userId: string;
    shareAmount: number;
    percentage?: number;
    weight?: number;
  }>;
}
