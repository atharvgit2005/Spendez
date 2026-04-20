"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDTO = exports.LoginDTO = exports.RegisterDTO = void 0;
const zod_1 = require("zod");
exports.RegisterDTO = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(100),
});
exports.LoginDTO = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.RefreshTokenDTO = zod_1.z.object({
    token: zod_1.z.string().min(1),
});
