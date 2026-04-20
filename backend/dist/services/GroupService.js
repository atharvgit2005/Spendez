"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const mongoose_1 = require("mongoose");
const GroupRepository_1 = require("../repositories/GroupRepository");
const GroupMember_1 = require("../models/GroupMember");
const Group_1 = require("../models/Group");
const AppError_1 = require("../errors/AppError");
const errorCodes_1 = require("../errors/errorCodes");
class GroupService {
    constructor() {
        this.groupRepo = new GroupRepository_1.GroupRepository();
    }
    async createGroup(dto) {
        const creatorId = new mongoose_1.Types.ObjectId(dto.createdBy);
        const group = await this.groupRepo.create({
            ...dto,
            createdBy: creatorId,
            memberIds: [creatorId],
            joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        });
        // Add creator as ADMIN member
        await GroupMember_1.GroupMember.create({
            groupId: group.id,
            userId: dto.createdBy,
            memberRole: 'ADMIN',
            joinedAt: new Date(),
        });
        return group;
    }
    async joinByCode(userId, joinCode) {
        const group = await Group_1.Group.findOne({ joinCode: joinCode.toUpperCase(), isArchived: false });
        if (!group)
            throw new AppError_1.NotFoundError('Group', joinCode);
        const existing = await GroupMember_1.GroupMember.findOne({ groupId: group._id, userId });
        if (existing?.isActive) {
            return group; // Already a member, just return
        }
        await GroupMember_1.GroupMember.findOneAndUpdate({ groupId: group._id, userId }, { memberRole: 'MEMBER', isActive: true, joinedAt: new Date() }, { upsert: true, new: true });
        await this.groupRepo.update(group.id, {
            $addToSet: { memberIds: userId },
        });
        return group;
    }
    async getGroup(groupId) {
        const group = await this.groupRepo.findById(groupId);
        if (!group)
            throw new AppError_1.NotFoundError('Group', groupId);
        return group;
    }
    async getUserGroups(userId) {
        return this.groupRepo.findByMember(userId);
    }
    async updateGroup(groupId, actorId, data) {
        await this.assertAdminRole(groupId, actorId);
        const updated = await this.groupRepo.update(groupId, data);
        if (!updated)
            throw new AppError_1.NotFoundError('Group', groupId);
        return updated;
    }
    async archiveGroup(groupId, actorId) {
        await this.assertAdminRole(groupId, actorId);
        await this.groupRepo.delete(groupId);
    }
    async addMember(groupId, actorId, userId) {
        await this.assertAdminRole(groupId, actorId);
        const group = await this.groupRepo.findById(groupId);
        if (!group)
            throw new AppError_1.NotFoundError('Group', groupId);
        const existing = await GroupMember_1.GroupMember.findOne({ groupId, userId });
        if (existing?.isActive) {
            throw new AppError_1.AppError(409, errorCodes_1.ErrorCodes.GROUP_MEMBER_CONFLICT, 'User is already a member');
        }
        await GroupMember_1.GroupMember.findOneAndUpdate({ groupId, userId }, { memberRole: 'MEMBER', isActive: true, joinedAt: new Date() }, { upsert: true, new: true });
        await this.groupRepo.update(groupId, {
            $addToSet: { memberIds: userId },
        });
    }
    async removeMember(groupId, actorId, userId) {
        await this.assertAdminRole(groupId, actorId);
        await GroupMember_1.GroupMember.findOneAndUpdate({ groupId, userId }, { isActive: false });
        await this.groupRepo.update(groupId, {
            $pull: { memberIds: userId },
        });
    }
    async assertAdminRole(groupId, userId) {
        const member = await GroupMember_1.GroupMember.findOne({ groupId, userId, isActive: true });
        if (!member || member.memberRole !== 'ADMIN') {
            throw new AppError_1.ForbiddenError('Only group admins can perform this action');
        }
    }
}
exports.GroupService = GroupService;
