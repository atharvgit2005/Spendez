import { ISplit } from '../../models/Split';

export interface ISplitRepository {
  create(data: Partial<ISplit>): Promise<ISplit>;
  findById(id: string): Promise<ISplit | null>;
  findAll(filter?: Record<string, unknown>): Promise<ISplit[]>;
  findByExpense(expenseId: string): Promise<ISplit[]>;
  update(id: string, data: Partial<ISplit>): Promise<ISplit | null>;
  delete(id: string): Promise<void>;
}
