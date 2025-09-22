import { Router } from 'express';
import { deleteuser, searchfavorite } from '../controllers/userController.js';

const userRouter = Router();

userRouter.delete('/deleteuser', deleteuser);
userRouter.post('/searchfavorite', searchfavorite);

export default userRouter;
