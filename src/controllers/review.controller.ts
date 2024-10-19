import express from "express";
import {
  createReview,
  updateReview,
  getAllReviews,
  getReview,
  deleteReview,
} from "../services/review.services";
import { protect, restrictTo } from "../services/auth.services";
import {
  createReviewBodyValidator,
  reviewIdValidator,
  updateReviewBodyValidator,
} from "../middlewares/validators/review.validator";
import { findAllFilterObj } from "../utils/handlerFactory";

const reviewRouter = express.Router();
reviewRouter
  .route("/")
  .post(protect, createReviewBodyValidator, createReview)
  .get(protect, findAllFilterObj, getAllReviews);
reviewRouter.put("/:id", protect, updateReviewBodyValidator, updateReview);

reviewRouter.delete("/:id", protect, reviewIdValidator, deleteReview);

reviewRouter.get("/:id", protect, reviewIdValidator, getReview);
export default reviewRouter;
