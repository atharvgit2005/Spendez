"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../errors/AppError");
const errorCodes_1 = require("../errors/errorCodes");
class AuthService {
    constructor() {
        this.userRepo = new UserRepository_1.UserRepository();
    }
    async register(dto) {
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) {
            throw new AppError_1.AppError(409, errorCodes_1.ErrorCodes.DUPLICATE_RESOURCE, 'Email already registered');
        }
        const passwordHash = await (0, hash_1.hashPassword)(dto.password);
        const user = await this.userRepo.create({ name: dto.name, email: dto.email, passwordHash });
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
        const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id, role: user.role });
        return { user, accessToken, refreshToken };
    }
    async login(dto) {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user || !user.isActive) {
            throw new AppError_1.UnauthorizedError('Invalid credentials');
        }
        const valid = await user.verifyPassword(dto.password);
        if (!valid) {
            throw new AppError_1.UnauthorizedError('Invalid credentials');
        }
        await this.userRepo.update(user.id, { lastLoginAt: new Date() });
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
        const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id, role: user.role });
        return { user, accessToken, refreshToken };
    }
    async refreshTokens(token) {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await this.userRepo.findById(payload.userId);
        if (!user || !user.isActive) {
            throw new AppError_1.UnauthorizedError('User not found or inactive');
        }
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
        const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id, role: user.role });
        return { accessToken, refreshToken };
    }
    async getCurrentUser(id) {
        const user = await this.userRepo.findById(id);
        if (!user || !user.isActive) {
            throw new AppError_1.UnauthorizedError('User not found or inactive');
        }
        return user;
    }
}
exports.AuthService = AuthService;
