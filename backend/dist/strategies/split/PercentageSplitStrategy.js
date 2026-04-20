"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentageSplitStrategy = void 0;
const AppError_1 = require("../../errors/AppError");
class PercentageSplitStrategy {
    calculateShares(_expenseId, amount, config) {
        const { participants, percentages } = config;
        if (!percentages) {
            throw new AppError_1.DomainError('SPLIT_ERROR', 'Percentages are required for PERCENTAGE split type');
        }
        const total = Object.values(percentages).reduce((sum, p) => sum + p, 0);
        if (Math.abs(total - 100) > 0.01) {
            throw new AppError_1.DomainError('PERCENTAGE_MISMATCH', `Percentages must sum to 100, got ${total}`);
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
exports.PercentageSplitStrategy = PercentageSplitStrategy;
