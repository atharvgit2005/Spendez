"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitContext = void 0;
class SplitContext {
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    execute(expenseId, amount, config) {
        if (!this.strategy) {
            throw new Error('No split strategy has been set');
        }
        return this.strategy.calculateShares(expenseId, amount, config);
    }
}
exports.SplitContext = SplitContext;
