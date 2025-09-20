import { Router } from 'express';
import {
  approveRequest,
  createGroup,
  deleteGroup,
  groupRequest,
  rejectRequest,
} from '../controllers/groupController.js';

const groupRouter = Router();

groupRouter.post('/create', createGroup);
groupRouter.delete('/delete', deleteGroup);
groupRouter.post('/request', groupRequest);
groupRouter.put('/approve', approveRequest);
groupRouter.put('/reject', rejectRequest);

export default groupRouter;
