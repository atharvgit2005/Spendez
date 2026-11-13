"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AIController_1 = require("../controllers/AIController");
const router = (0, express_1.Router)();
const aiController = new AIController_1.AIController();
router.post('/chat', aiController.chat);
exports.default = router;
