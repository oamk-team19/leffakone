import { Router } from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";

const reviewRouter = Router();

reviewRouter.post('/create', createReview);

reviewRouter.get('/', getReviews);

export default reviewRouter;