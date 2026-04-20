import { IBudget } from '../../models/Budget';

export interface IBudgetRepository {
  create(data: Partial<IBudget>): Promise<IBudget>;
  findById(id: string): Promise<IBudget | null>;
  findAll(filter?: Record<string, unknown>): Promise<IBudget[]>;
  findByOwner(ownerType: 'USER' | 'GROUP', ownerId: string): Promise<IBudget | null>;
  update(id: string, data: Partial<IBudget>): Promise<IBudget | null>;
  delete(id: string): Promise<void>;
}
