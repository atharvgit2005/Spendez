"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const mongoose_1 = require("mongoose");
const ExpenseRepository_1 = require("../repositories/ExpenseRepository");
const AppError_1 = require("../errors/AppError");
const EventPublisher_1 = require("../events/EventPublisher");
const GroupMemberRepository_1 = require("../repositories/GroupMemberRepository");
const GroupRepository_1 = require("../repositories/GroupRepository");
const SplitRepository_1 = require("../repositories/SplitRepository");
const StrategyFactory_1 = require("../factories/StrategyFactory");
class ExpenseService {
    constructor() {
        this.expenseRepo = new ExpenseRepository_1.ExpenseRepository();
        this.splitRepo = new SplitRepository_1.SplitRepository();
        this.groupRepo = new GroupRepository_1.GroupRepository();
        this.groupMemberRepo = new GroupMemberRepository_1.GroupMemberRepository();
    }
    async createExpense(dto) {
        const group = await this.groupRepo.findById(dto.groupId);
        if (!group)
            throw new AppError_1.NotFoundError('Group', dto.groupId);
        const expenseData = {
            ...dto,
            groupId: new mongoose_1.Types.ObjectId(dto.groupId),
            paidBy: new mongoose_1.Types.ObjectId(dto.paidBy),
        };
        // Create the expense record
        const expense = await this.expenseRepo.create(expenseData);
        // 1. Resolve participants
        let participantIds = dto.splitConfig?.participants;
        if (!participantIds || participantIds.length === 0) {
            const members = await this.groupMemberRepo.findByGroup(dto.groupId);
            participantIds = members.map((m) => m.userId.toString());
        }
        // 2. Select and execute strategy
        const strategy = StrategyFactory_1.StrategyFactory.createSplitStrategy(dto.splitType);
        const shares = strategy.calculateShares(expense.id, expense.amount, {
            participants: participantIds || [],
            percentages: dto.splitConfig?.percentages,
            weights: dto.splitConfig?.weights,
            exactAmounts: dto.splitConfig?.exactAmounts,
        });
        // 3. Persist splits
        await this.splitRepo.insertMany(shares.map((share) => ({
            ...share,
            expenseId: expense._id,
            userId: new mongoose_1.Types.ObjectId(share.userId),
            status: 'PENDING',
        })));
        // 4. Notifications
        EventPublisher_1.eventPublisher.emit(EventPublisher_1.Events.EXPENSE_CREATED, {
            expense,
            groupMembers: participantIds,
        });
        return expense;
    }
    async getExpense(id) {
        const expense = await this.expenseRepo.findById(id);
        if (!expense)
            throw new AppError_1.NotFoundError('Expense', id);
        return expense;
    }
    async getGroupExpenses(groupId, page = 1, limit = 20) {
        return this.expenseRepo.findByGroup(groupId, page, limit);
    }
    async updateExpense(id, actorId, data) {
        const expense = await this.expenseRepo.findById(id);
        if (!expense)
            throw new AppError_1.NotFoundError('Expense', id);
        if (expense.paidBy.toString() !== actorId) {
            throw new AppError_1.ForbiddenError('Only the payer can edit this expense');
        }
        const updated = await this.expenseRepo.update(id, data);
        return updated;
    }
    async deleteExpense(id, actorId) {
        const expense = await this.expenseRepo.findById(id);
        if (!expense)
            throw new AppError_1.NotFoundError('Expense', id);
        if (expense.paidBy.toString() !== actorId) {
            throw new AppError_1.ForbiddenError('Only the payer can delete this expense');
        }
        await this.splitRepo.deleteByExpense(expense._id.toString());
        await this.expenseRepo.delete(id);
    }
}
exports.ExpenseService = ExpenseService;
