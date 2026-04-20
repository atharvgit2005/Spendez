import { IExpense } from '../../models/Expense';

export interface IExpenseRepository {
  create(data: Partial<IExpense>): Promise<IExpense>;
  findById(id: string): Promise<IExpense | null>;
  findAll(filter?: Record<string, unknown>): Promise<IExpense[]>;
  findByGroup(groupId: string, page?: number, limit?: number): Promise<IExpense[]>;
  update(id: string, data: Partial<IExpense>): Promise<IExpense | null>;
  delete(id: string): Promise<void>;
}
