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
  getGroupCreator,
  leaveGroup,
} from '../controllers/groupController.js';

const groupRouter = Router();

groupRouter.post('/create', createGroup);
groupRouter.delete('/delete', deleteGroup);
groupRouter.delete('/leavegroup', leaveGroup);
groupRouter.post('/request', groupRequest);
groupRouter.put('/approve', approveRequest);
groupRouter.put('/reject', rejectRequest);
groupRouter.get('/members/:idgroup', getGroupMembers);
groupRouter.get('/name/:idgroup', getGroupName);
groupRouter.get('/creator/:idgroup', getGroupCreator);
groupRouter.get('/groups', getGroups);
groupRouter.get('/mygroups/:idUser', getMyGroups);

export default groupRouter;
