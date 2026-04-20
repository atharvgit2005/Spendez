"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMemberDTO = exports.CreateGroupDTO = void 0;
const zod_1 = require("zod");
exports.CreateGroupDTO = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    type: zod_1.z.enum(['TRIP', 'HOSTEL', 'EVENT', 'OTHER']),
    description: zod_1.z.string().max(500).optional(),
});
exports.AddMemberDTO = zod_1.z.object({
    userId: zod_1.z.string().min(1),
});
