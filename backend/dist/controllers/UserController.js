"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const GroupService_1 = require("../services/GroupService");
const userService = new UserService_1.UserService();
const groupService = new GroupService_1.GroupService();
class UserController {
    async getMe(req, res, next) {
        try {
            const user = await userService.getProfile(req.user.userId);
            res.json({ success: true, data: user });
        }
        catch (err) {
            next(err);
        }
    }
    async updateMe(req, res, next) {
        try {
            const user = await userService.updateProfile(req.user.userId, req.body);
            res.json({ success: true, data: user });
        }
        catch (err) {
            next(err);
        }
    }
    async getMyGroups(req, res, next) {
        try {
            const groups = await groupService.getUserGroups(req.user.userId);
            res.json({ success: true, data: groups });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
