import { BudgetRepository } from '../repositories/BudgetRepository';
import { IBudget } from '../models/Budget';
import { NotFoundError, AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/errorCodes';
import { eventPublisher, Events } from '../events/EventPublisher';

interface CreateBudgetDTO {
  ownerType: 'USER' | 'GROUP';
  ownerId: string;
  limitAmount: number;
  periodType: IBudget['periodType'];
  periodStart: Date;
  periodEnd: Date;
  alertThreshold?: number;
}

export class BudgetService {
  private budgetRepo = new BudgetRepository();

  async createBudget(dto: CreateBudgetDTO): Promise<IBudget> {
    const existing = await this.budgetRepo.findByOwner(dto.ownerType, dto.ownerId);
    if (existing) {
      throw new AppError(409, ErrorCodes.DUPLICATE_RESOURCE, 'A budget already exists for this owner');
    }
    return this.budgetRepo.create(dto);
  }

  async getBudget(ownerType: 'USER' | 'GROUP', ownerId: string): Promise<IBudget> {
    const budget = await this.budgetRepo.findByOwner(ownerType, ownerId);
    if (!budget) throw new NotFoundError('Budget');
    return budget;
  }

  async updateBudget(id: string, data: Partial<IBudget>): Promise<IBudget> {
    const budget = await this.budgetRepo.update(id, data);
    if (!budget) throw new NotFoundError('Budget', id);
    return budget;
  }

  async incrementUsage(ownerType: 'USER' | 'GROUP', ownerId: string, amount: number): Promise<void> {
    const budget = await this.budgetRepo.findByOwner(ownerType, ownerId);
    if (!budget || !budget.alertEnabled) return;

    const newUsed = budget.usedAmount + amount;
    await this.budgetRepo.update(budget.id, { usedAmount: newUsed });

    const usageRatio = newUsed / budget.limitAmount;
    if (usageRatio >= budget.alertThreshold) {
      (eventPublisher as any).emit(Events.BUDGET_ALERT, { userId: ownerId, budget });
    }
  }
}
