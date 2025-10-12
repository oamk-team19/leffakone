import { Router } from 'express';
import {
  deleteuser,
  searchfavorite,
  addFavorite,
  removeFavorite,
  searchFavoriteByEmail,
  searchAllRequests
} from '../controllers/userController.js';
import { auth } from '../helpers/auth.js';

const userRouter = Router();

userRouter.delete('/deleteuser', deleteuser);
userRouter.get('/searchfavorite', searchfavorite);
userRouter.get('/favorite', auth, searchFavoriteByEmail);
userRouter.get('/searchAllRequests', searchAllRequests);
userRouter.post('/favorite', auth, addFavorite);
userRouter.delete('/favorite', auth, removeFavorite);

export default userRouter;

