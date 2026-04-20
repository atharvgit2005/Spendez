"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
const Group_1 = require("../models/Group");
class GroupRepository {
    async create(data) {
        return Group_1.Group.create(data);
    }
    async findById(id) {
        return Group_1.Group.findById(id).populate('createdBy', 'name email avatarUrl');
    }
    async findAll(filter = {}) {
        return Group_1.Group.find(filter).populate('createdBy', 'name email');
    }
    async findByMember(userId) {
        return Group_1.Group.find({ memberIds: userId, isArchived: false });
    }
    async update(id, data) {
        return Group_1.Group.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Group_1.Group.findByIdAndUpdate(id, { isArchived: true });
    }
}
exports.GroupRepository = GroupRepository;
