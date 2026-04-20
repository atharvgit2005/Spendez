import { Types } from 'mongoose';
import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { IExpense } from '../models/Expense';
import { NotFoundError, ForbiddenError } from '../errors/AppError';
import { eventPublisher, Events } from '../events/EventPublisher';
import { GroupMemberRepository } from '../repositories/GroupMemberRepository';
import { GroupRepository } from '../repositories/GroupRepository';
import { SplitRepository } from '../repositories/SplitRepository';
import { StrategyFactory } from '../factories/StrategyFactory';

interface CreateExpenseDTO {
  groupId: string;
  paidBy: string;
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  category?: IExpense['category'];
  splitType: IExpense['splitType'];
  splitConfig?: {
    participants?: string[];
    percentages?: Record<string, number>;
    weights?: Record<string, number>;
    exactAmounts?: Record<string, number>;
  };
  expenseDate?: Date;
  sourceType?: IExpense['sourceType'];
}

export class ExpenseService {
  private expenseRepo = new ExpenseRepository();
  private splitRepo = new SplitRepository();
  private groupRepo = new GroupRepository();
  private groupMemberRepo = new GroupMemberRepository();

  async createExpense(dto: CreateExpenseDTO): Promise<IExpense> {
    const group = await this.groupRepo.findById(dto.groupId);
    if (!group) throw new NotFoundError('Group', dto.groupId);

    const expenseData = {
      ...dto,
      groupId: new Types.ObjectId(dto.groupId),
      paidBy:  new Types.ObjectId(dto.paidBy),
    };
    
    // Create the expense record
    const expense = await this.expenseRepo.create(expenseData as any);

    // 1. Resolve participants
    let participantIds = dto.splitConfig?.participants;
    if (!participantIds || participantIds.length === 0) {
      const members = await this.groupMemberRepo.findByGroup(dto.groupId);
      participantIds = members.map((m: any) => m.userId.toString());
    }

    // 2. Select and execute strategy
    const strategy = StrategyFactory.createSplitStrategy(dto.splitType as any);
    const shares = strategy.calculateShares(
      expense.id,
      expense.amount,
      {
        participants: participantIds || [],
        percentages:  dto.splitConfig?.percentages,
        weights:      dto.splitConfig?.weights,
        exactAmounts: dto.splitConfig?.exactAmounts,
      }
    );

    // 3. Persist splits
    await this.splitRepo.insertMany(
      shares.map((share) => ({
        ...share,
        expenseId: (expense as any)._id,
        userId:    new Types.ObjectId(share.userId),
        status:    'PENDING',
      }))
    );

    // 4. Notifications
    (eventPublisher as any).emit(Events.EXPENSE_CREATED, {
      expense,
      groupMembers: participantIds,
    });

    return expense;
  }

  async getExpense(id: string): Promise<IExpense> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) throw new NotFoundError('Expense', id);
    return expense;
  }

  async getGroupExpenses(groupId: string, page = 1, limit = 20): Promise<IExpense[]> {
    return this.expenseRepo.findByGroup(groupId, page, limit);
  }

  async updateExpense(id: string, actorId: string, data: Partial<IExpense>): Promise<IExpense> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) throw new NotFoundError('Expense', id);
    if (expense.paidBy.toString() !== actorId) {
      throw new ForbiddenError('Only the payer can edit this expense');
    }
    const updated = await this.expenseRepo.update(id, data);
    return updated!;
  }

  async deleteExpense(id: string, actorId: string): Promise<void> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) throw new NotFoundError('Expense', id);
    if (expense.paidBy.toString() !== actorId) {
      throw new ForbiddenError('Only the payer can delete this expense');
    }
    await this.splitRepo.deleteByExpense((expense as any)._id.toString());
    await this.expenseRepo.delete(id);
  }
}
