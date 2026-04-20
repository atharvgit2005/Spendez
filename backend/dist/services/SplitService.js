"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitService = void 0;
const SplitRepository_1 = require("../repositories/SplitRepository");
const ExpenseRepository_1 = require("../repositories/ExpenseRepository");
const StrategyFactory_1 = require("../factories/StrategyFactory");
const SplitContext_1 = require("../strategies/split/SplitContext");
const AppError_1 = require("../errors/AppError");
class SplitService {
    constructor() {
        this.splitRepo = new SplitRepository_1.SplitRepository();
        this.expenseRepo = new ExpenseRepository_1.ExpenseRepository();
    }
    async applySplit(expenseId, config) {
        const expense = await this.expenseRepo.findById(expenseId);
        if (!expense)
            throw new AppError_1.NotFoundError('Expense', expenseId);
        const strategy = StrategyFactory_1.StrategyFactory.createSplitStrategy(expense.splitType);
        const context = new SplitContext_1.SplitContext();
        context.setStrategy(strategy);
        const shares = context.execute(expenseId, expense.amount, config);
        // Delete existing splits for this expense before saving new ones
        await ISplitDelete(expenseId, this.splitRepo);
        const splits = await Promise.all(shares.map((share) => this.splitRepo.create({
            expenseId: expenseId,
            userId: share.userId,
            shareAmount: share.shareAmount,
            percentage: share.percentage,
            weight: share.weight,
            status: 'PENDING',
        })));
        return splits;
    }
    async getSplitsForExpense(expenseId) {
        return this.splitRepo.findByExpense(expenseId);
    }
    async settleUserSplit(splitId) {
        const split = await this.splitRepo.findById(splitId);
        if (!split)
            throw new AppError_1.NotFoundError('Split', splitId);
        if (split.status === 'SETTLED') {
            throw new AppError_1.DomainError('ALREADY_SETTLED', 'This split is already settled');
        }
        const updated = await this.splitRepo.update(splitId, { status: 'SETTLED', settledAt: new Date() });
        return updated;
    }
}
exports.SplitService = SplitService;
async function ISplitDelete(expenseId, splitRepo) {
    const existing = await splitRepo.findByExpense(expenseId);
    await Promise.all(existing.map((s) => splitRepo.delete(s.id)));
}
