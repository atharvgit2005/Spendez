"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyDebts = simplifyDebts;
/**
 * Graph-based debt simplification algorithm.
 * Minimises the number of transactions needed to settle all debts in a group.
 */
function simplifyDebts(rawDebts) {
    // Step 1: Calculate net balance for each person
    const net = {};
    for (const { from, to, amount } of rawDebts) {
        net[from] = (net[from] || 0) - amount;
        net[to] = (net[to] || 0) + amount;
    }
    // Step 2: Separate into creditors (positive net) and debtors (negative net)
    const creditors = [];
    const debtors = [];
    for (const [id, balance] of Object.entries(net)) {
        if (balance > 0.01)
            creditors.push({ id, amount: balance });
        else if (balance < -0.01)
            debtors.push({ id, amount: -balance });
    }
    // Step 3: Greedy matching to minimise transactions
    const simplified = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const settleAmount = Math.min(debtor.amount, creditor.amount);
        simplified.push({
            from: debtor.id,
            to: creditor.id,
            amount: Math.round(settleAmount * 100) / 100,
        });
        debtor.amount -= settleAmount;
        creditor.amount -= settleAmount;
        if (debtor.amount < 0.01)
            i++;
        if (creditor.amount < 0.01)
            j++;
    }
    return simplified;
}
