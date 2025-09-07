import { Router } from 'express';
import { healthCheck } from '../controllers/rootController.js';

const rootRouter = Router();

rootRouter.get('/health', healthCheck);
export default rootRouter;
