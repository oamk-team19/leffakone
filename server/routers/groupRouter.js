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
  getSearchPending,
  getSearchfavorite,
  searchAllRequests,
  updateSeenRequest,
  getMyPendingRequests,
  deleteRequest,
  addMovieToGroup,
} from '../controllers/groupController.js';
import { auth } from '../helpers/auth.js';
const groupRouter = Router();

groupRouter.post('/create', createGroup);
groupRouter.delete('/delete', deleteGroup);
groupRouter.delete('/leavegroup', leaveGroup);
groupRouter.post('/request', groupRequest);
groupRouter.put('/approve', approveRequest);
groupRouter.put('/reject', rejectRequest);
groupRouter.put('/seenrequest', updateSeenRequest);
groupRouter.get('/members/:idgroup', getGroupMembers);
groupRouter.get('/name/:idgroup', getGroupName);
groupRouter.get('/creator/:idgroup', getGroupCreator);
groupRouter.get('/groups', getGroups);
groupRouter.get('/mygroups/:idUser', getMyGroups);
groupRouter.get('/searchPending', getSearchPending);
groupRouter.get('/searchfavorite/:idgroup', getSearchfavorite);
groupRouter.get('/searchAllRequests', searchAllRequests);
groupRouter.get('/requests/pending/:idUser', getMyPendingRequests);
groupRouter.delete('/requests/delete/:idUser/:idGroup', deleteRequest);
groupRouter.post('/favorite/:groupid', auth, addMovieToGroup);

export default groupRouter;
