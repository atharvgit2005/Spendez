"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const AuditLog_1 = require("../models/AuditLog");
class AuditService {
    async log(dto) {
        await AuditLog_1.AuditLog.create(dto);
    }
}
exports.AuditService = AuditService;
