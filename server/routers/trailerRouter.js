import { Router } from "express";
import { movieTrailer } from "../controllers/trailerController.js";

const trailerRouter = Router();

trailerRouter.get('/trailer', movieTrailer);
export default trailerRouter;