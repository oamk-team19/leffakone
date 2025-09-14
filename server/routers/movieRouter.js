import { Router } from 'express';
import { searchMovies } from '../controllers/movieController.js';

const rootRouter = Router();

rootRouter.get('/search', searchMovies);
export default rootRouter;
