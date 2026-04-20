"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightedSplitStrategy = void 0;
const AppError_1 = require("../../errors/AppError");
class WeightedSplitStrategy {
    calculateShares(_expenseId, amount, config) {
        const { participants, weights } = config;
        if (!weights) {
            throw new AppError_1.DomainError('SPLIT_ERROR', 'Weights are required for WEIGHTED split type');
        }
        const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
        if (totalWeight <= 0) {
            throw new AppError_1.DomainError('SPLIT_ERROR', 'Total weight must be positive');
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
exports.WeightedSplitStrategy = WeightedSplitStrategy;
