"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../errors/AppError");
class UserService {
    constructor() {
        this.userRepo = new UserRepository_1.UserRepository();
    }
    async getProfile(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new AppError_1.NotFoundError('User', userId);
        return user;
    }
    async updateProfile(userId, data) {
        const user = await this.userRepo.update(userId, data);
        if (!user)
            throw new AppError_1.NotFoundError('User', userId);
        return user;
    }
}
exports.UserService = UserService;
