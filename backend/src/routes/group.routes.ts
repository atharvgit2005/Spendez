import { Router } from 'express';
import { groupController } from '../controllers/GroupController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { CreateGroupDTO, AddMemberDTO } from '../dtos/group.dto';

const router = Router();
router.use(authMiddleware);

router.post('/',                          validate(CreateGroupDTO), groupController.create.bind(groupController));
router.post('/join',                     groupController.join.bind(groupController));
router.get('/:id',                        groupController.getOne.bind(groupController));
router.put('/:id',                        groupController.update.bind(groupController));
router.delete('/:id',                     groupController.archive.bind(groupController));
router.post('/:id/members',              validate(AddMemberDTO), groupController.addMember.bind(groupController));
router.delete('/:id/members/:userId',    groupController.removeMember.bind(groupController));
router.get('/:id/balances',              groupController.getBalances.bind(groupController));
router.get('/:id/simplified-debts',     groupController.getSimplifiedDebts.bind(groupController));
router.get('/:id/expenses',             (req, res, next) => {
  // Delegated to expense routes below via re-import
  next();
});

export default router;
