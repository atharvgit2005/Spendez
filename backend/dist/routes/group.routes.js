"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GroupController_1 = require("../controllers/GroupController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const group_dto_1 = require("../dtos/group.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/', (0, validate_middleware_1.validate)(group_dto_1.CreateGroupDTO), GroupController_1.groupController.create.bind(GroupController_1.groupController));
router.post('/join', GroupController_1.groupController.join.bind(GroupController_1.groupController));
router.get('/:id', GroupController_1.groupController.getOne.bind(GroupController_1.groupController));
router.put('/:id', GroupController_1.groupController.update.bind(GroupController_1.groupController));
router.delete('/:id', GroupController_1.groupController.archive.bind(GroupController_1.groupController));
router.post('/:id/members', (0, validate_middleware_1.validate)(group_dto_1.AddMemberDTO), GroupController_1.groupController.addMember.bind(GroupController_1.groupController));
router.delete('/:id/members/:userId', GroupController_1.groupController.removeMember.bind(GroupController_1.groupController));
router.get('/:id/balances', GroupController_1.groupController.getBalances.bind(GroupController_1.groupController));
router.get('/:id/simplified-debts', GroupController_1.groupController.getSimplifiedDebts.bind(GroupController_1.groupController));
router.get('/:id/expenses', (req, res, next) => {
    // Delegated to expense routes below via re-import
    next();
});
exports.default = router;
