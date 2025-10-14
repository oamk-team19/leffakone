import { Router } from 'express';
import {
  deleteuser,
  searchfavorite,
  addFavorite,
  removeFavorite,
  searchFavoriteByEmail,
  getUserNameById,
} from '../controllers/userController.js';
import { auth } from '../helpers/auth.js';

const userRouter = Router();

userRouter.delete('/deleteuser', auth, deleteuser);
userRouter.get('/searchfavorite', searchfavorite);
userRouter.get('/favorite', auth, searchFavoriteByEmail);
userRouter.post('/favorite', auth, addFavorite);
userRouter.delete('/favorite', auth, removeFavorite);
userRouter.get('/:id', getUserNameById);
export default userRouter;
