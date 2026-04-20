"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitConfigDTO = void 0;
const zod_1 = require("zod");
exports.SplitConfigDTO = zod_1.z.object({
    participants: zod_1.z.array(zod_1.z.string()).min(1),
    percentages: zod_1.z.record(zod_1.z.string(), zod_1.z.number()).optional(),
    weights: zod_1.z.record(zod_1.z.string(), zod_1.z.number()).optional(),
    exactAmounts: zod_1.z.record(zod_1.z.string(), zod_1.z.number()).optional(),
});
