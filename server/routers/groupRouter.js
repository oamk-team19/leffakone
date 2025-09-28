import { Router } from 'express';
import {
  approveRequest,
  createGroup,
  deleteGroup,
  getGroupMembers,
  getGroupName,
  groupRequest,
  rejectRequest,
} from '../controllers/groupController.js';

const groupRouter = Router();

groupRouter.post('/create', createGroup);
groupRouter.delete('/delete', deleteGroup);
groupRouter.post('/request', groupRequest);
groupRouter.put('/approve', approveRequest);
groupRouter.put('/reject', rejectRequest);
groupRouter.get('/members/:idgroup', getGroupMembers);
groupRouter.get('/name/:idgroup', getGroupName);

export default groupRouter;
