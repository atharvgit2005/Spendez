import { IBudgetRepository } from '../interfaces/repositories/IBudgetRepository';
import { Budget, IBudget } from '../models/Budget';

export class BudgetRepository implements IBudgetRepository {
  async create(data: Partial<IBudget>): Promise<IBudget> {
    return Budget.create(data);
  }

  async findById(id: string): Promise<IBudget | null> {
    return Budget.findById(id);
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<IBudget[]> {
    return Budget.find(filter);
  }

  async findByOwner(ownerType: 'USER' | 'GROUP', ownerId: string): Promise<IBudget | null> {
    return Budget.findOne({ ownerType, ownerId });
  }

  async update(id: string, data: Partial<IBudget>): Promise<IBudget | null> {
    return Budget.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Budget.findByIdAndDelete(id);
  }
}
