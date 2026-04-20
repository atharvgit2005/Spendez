"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const BudgetRepository_1 = require("../repositories/BudgetRepository");
const AppError_1 = require("../errors/AppError");
const errorCodes_1 = require("../errors/errorCodes");
const EventPublisher_1 = require("../events/EventPublisher");
class BudgetService {
    constructor() {
        this.budgetRepo = new BudgetRepository_1.BudgetRepository();
    }
    async createBudget(dto) {
        const existing = await this.budgetRepo.findByOwner(dto.ownerType, dto.ownerId);
        if (existing) {
            throw new AppError_1.AppError(409, errorCodes_1.ErrorCodes.DUPLICATE_RESOURCE, 'A budget already exists for this owner');
        }
        return this.budgetRepo.create(dto);
    }
    async getBudget(ownerType, ownerId) {
        const budget = await this.budgetRepo.findByOwner(ownerType, ownerId);
        if (!budget)
            throw new AppError_1.NotFoundError('Budget');
        return budget;
    }
    async updateBudget(id, data) {
        const budget = await this.budgetRepo.update(id, data);
        if (!budget)
            throw new AppError_1.NotFoundError('Budget', id);
        return budget;
    }
    async incrementUsage(ownerType, ownerId, amount) {
        const budget = await this.budgetRepo.findByOwner(ownerType, ownerId);
        if (!budget || !budget.alertEnabled)
            return;
        const newUsed = budget.usedAmount + amount;
        await this.budgetRepo.update(budget.id, { usedAmount: newUsed });
        const usageRatio = newUsed / budget.limitAmount;
        if (usageRatio >= budget.alertThreshold) {
            EventPublisher_1.eventPublisher.emit(EventPublisher_1.Events.BUDGET_ALERT, { userId: ownerId, budget });
        }
    }
}
exports.BudgetService = BudgetService;
