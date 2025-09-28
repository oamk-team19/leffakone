import { Router } from "express";
import { movieInfo } from '../controllers/movieinfoController.js';


const movieinfoRouter = Router();

movieinfoRouter.get('/info', movieInfo);
export default movieinfoRouter;