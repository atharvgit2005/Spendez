"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupController = exports.GroupController = void 0;
const GroupService_1 = require("../services/GroupService");
const PaymentService_1 = require("../services/PaymentService");
const groupService = new GroupService_1.GroupService();
const paymentService = new PaymentService_1.PaymentService();
class GroupController {
    async create(req, res, next) {
        try {
            const group = await groupService.createGroup({ ...req.body, createdBy: req.user.userId });
            res.status(201).json({ success: true, data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async join(req, res, next) {
        try {
            const group = await groupService.joinByCode(req.user.userId, req.body.joinCode);
            res.json({ success: true, data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async getOne(req, res, next) {
        try {
            const group = await groupService.getGroup(req.params.id);
            res.json({ success: true, data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const group = await groupService.updateGroup(req.params.id, req.user.userId, req.body);
            res.json({ success: true, data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async archive(req, res, next) {
        try {
            await groupService.archiveGroup(req.params.id, req.user.userId);
            res.json({ success: true, message: 'Group archived' });
        }
        catch (err) {
            next(err);
        }
    }
    async addMember(req, res, next) {
        try {
            await groupService.addMember(req.params.id, req.user.userId, req.body.userId);
            res.json({ success: true, message: 'Member added' });
        }
        catch (err) {
            next(err);
        }
    }
    async removeMember(req, res, next) {
        try {
            await groupService.removeMember(req.params.id, req.user.userId, req.params.userId);
            res.json({ success: true, message: 'Member removed' });
        }
        catch (err) {
            next(err);
        }
    }
    async getBalances(req, res, next) {
        try {
            const balances = await paymentService.getGroupBalances(req.params.id);
            res.json({ success: true, data: balances });
        }
        catch (err) {
            next(err);
        }
    }
    async getSimplifiedDebts(req, res, next) {
        try {
            const debts = await paymentService.getSimplifiedDebts(req.params.id);
            res.json({ success: true, data: debts });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.GroupController = GroupController;
exports.groupController = new GroupController();
