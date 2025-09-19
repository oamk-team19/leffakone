import { Router } from 'express';
import { signin, signup, signout, deleteuser } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/signin', signin);
authRouter.post('/signup', signup);
authRouter.post('/signout', signout);
authRouter.delete('/deleteuser', deleteuser);


export default authRouter;
