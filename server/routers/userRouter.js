import { Router } from 'express';
import {
  deleteuser,
  searchfavorite,
  addFavorite,
  removeFavorite,
} from '../controllers/userController.js';
import { auth } from '../helpers/auth.js';

const userRouter = Router();

userRouter.delete('/deleteuser', deleteuser);
userRouter.get('/searchfavorite', searchfavorite);
userRouter.post('/favorite', auth, addFavorite);
userRouter.delete('/favorite', auth, removeFavorite);

export default userRouter;
