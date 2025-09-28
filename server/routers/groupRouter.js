import { Router } from 'express';
import {
  approveRequest,
  createGroup,
  deleteGroup,
  getGroupMembers,
  groupRequest,
  rejectRequest,
} from '../controllers/groupController.js';

const groupRouter = Router();

groupRouter.post('/create', createGroup);
groupRouter.delete('/delete', deleteGroup);
groupRouter.post('/request', groupRequest);
groupRouter.put('/approve', approveRequest);
groupRouter.put('/reject', rejectRequest);
groupRouter.get('/:idgroup', getGroupMembers);

export default groupRouter;
