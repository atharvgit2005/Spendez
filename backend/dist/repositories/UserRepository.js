"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../models/User");
class UserRepository {
    async create(data) {
        return User_1.User.create(data);
    }
    async findById(id) {
        return User_1.User.findById(id);
    }
    async findByEmail(email) {
        return User_1.User.findOne({ email: email.toLowerCase() });
    }
    async findAll(filter = {}) {
        return User_1.User.find(filter);
    }
    async update(id, data) {
        return User_1.User.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await User_1.User.findByIdAndDelete(id);
    }
}
exports.UserRepository = UserRepository;
