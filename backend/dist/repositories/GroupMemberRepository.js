"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMemberRepository = void 0;
const GroupMember_1 = require("../models/GroupMember");
class GroupMemberRepository {
    async create(data) {
        return GroupMember_1.GroupMember.create(data);
    }
    async findByGroup(groupId, filterActive = true) {
        const query = { groupId };
        if (filterActive)
            query.isActive = true;
        return GroupMember_1.GroupMember.find(query).populate('userId', 'name email avatarUrl');
    }
    async findByUser(userId) {
        return GroupMember_1.GroupMember.find({ userId, isActive: true }).populate('groupId');
    }
    async update(id, data) {
        return GroupMember_1.GroupMember.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await GroupMember_1.GroupMember.findByIdAndUpdate(id, { isActive: false });
    }
}
exports.GroupMemberRepository = GroupMemberRepository;
