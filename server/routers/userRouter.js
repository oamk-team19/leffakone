import { Router } from 'express';
import { deleteuser, searchfavorite, addFavorite } from '../controllers/userController.js';
import { auth } from '../helpers/auth.js';

const userRouter = Router();

userRouter.delete('/deleteuser', deleteuser);
userRouter.get('/searchfavorite', searchfavorite);
userRouter.get('/favorite', auth, addFavorite);

export default userRouter;
