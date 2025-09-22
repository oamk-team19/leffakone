import { Router } from 'express';
import { signin, signup, signout } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/signin', signin);
authRouter.post('/signup', signup);
authRouter.post('/signout', signout);

export default authRouter;
