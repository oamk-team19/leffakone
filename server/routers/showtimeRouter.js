import { Router } from "express";
import { createShowtime, getShowtimes } from "../controllers/showtimeController.js";

const showtimeRouter = Router();

showtimeRouter.post('/create', createShowtime);

showtimeRouter.get('/', getShowtimes)

export default showtimeRouter;