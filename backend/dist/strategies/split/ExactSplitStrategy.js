"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExactSplitStrategy = void 0;
const AppError_1 = require("../../errors/AppError");
class ExactSplitStrategy {
    calculateShares(_expenseId, amount, config) {
        const { participants, exactAmounts } = config;
        if (!exactAmounts) {
            throw new AppError_1.DomainError('SPLIT_ERROR', 'Exact amounts are required for EXACT split type');
        }
        const total = Object.values(exactAmounts).reduce((sum, a) => sum + a, 0);
        if (Math.abs(total - amount) > 0.01) {
            throw new AppError_1.DomainError('SPLIT_ERROR', `Exact amounts (${total}) must sum to total amount (${amount})`);
        }
        return participants.map((userId) => ({
            userId,
            shareAmount: exactAmounts[userId] ?? 0,
        }));
    }
}
exports.ExactSplitStrategy = ExactSplitStrategy;
