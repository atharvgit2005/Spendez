"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EqualSplitStrategy = void 0;
const AppError_1 = require("../../errors/AppError");
class EqualSplitStrategy {
    calculateShares(_expenseId, amount, config) {
        const { participants } = config;
        if (!participants || participants.length === 0) {
            throw new AppError_1.DomainError('SPLIT_ERROR', 'At least one participant is required');
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
exports.EqualSplitStrategy = EqualSplitStrategy;
