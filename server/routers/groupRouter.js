import { Router } from 'express';
import {
  approveRequest,
  createGroup,
  deleteGroup,
  getGroupMembers,
  getGroupName,
  groupRequest,
  getGroups,
  rejectRequest,
  getMyGroups,
} from '../controllers/groupController.js';

const groupRouter = Router();

groupRouter.post('/create', createGroup);
groupRouter.delete('/delete', deleteGroup);
groupRouter.post('/request', groupRequest);
groupRouter.put('/approve', approveRequest);
groupRouter.put('/reject', rejectRequest);
groupRouter.get('/members/:idgroup', getGroupMembers);
groupRouter.get('/name/:idgroup', getGroupName);
groupRouter.get('/groups', getGroups);
groupRouter.get('/mygroups/:idUser', getMyGroups);

export default groupRouter;
