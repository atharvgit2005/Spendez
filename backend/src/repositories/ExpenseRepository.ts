import { IExpenseRepository } from '../interfaces/repositories/IExpenseRepository';
import { Expense, IExpense } from '../models/Expense';

export class ExpenseRepository implements IExpenseRepository {
  async create(data: Partial<IExpense>): Promise<IExpense> {
    return Expense.create(data);
  }

  async findById(id: string): Promise<IExpense | null> {
    return Expense.findById(id)
      .populate('paidBy', 'name email avatarUrl')
      .populate('groupId', 'name');
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<IExpense[]> {
    return Expense.find(filter).sort({ expenseDate: -1 });
  }

  async findByGroup(groupId: string, page = 1, limit = 20): Promise<IExpense[]> {
    return Expense.find({ groupId })
      .populate('paidBy', 'name email avatarUrl')
      .sort({ expenseDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async update(id: string, data: Partial<IExpense>): Promise<IExpense | null> {
    return Expense.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Expense.findByIdAndDelete(id);
  }
}
