import { Request, Response, NextFunction } from "express";
import Review, { IReview } from "../models/review.model";
import catchAsync from "express-async-handler";
//import * as a from "../types/types";
import { getAll, getOne } from "../utils/handlerFactory";
import AppError from "../utils/appError";
import { calcAvgRatingsAndQuantity, isReviewMine } from "../utils/aggregation";
import {
  createReviewBody,
  reviewParams,
  updateReviewBody,
} from "../dtos/review.dto";

export const createReview = catchAsync(
  async (
    req: Request<{}, {}, createReviewBody>,
    res: Response,
    next: NextFunction
  ) => {
    const review = await Review.create({
      user: req.user?.id,
      product: req.body.product,
      title: req.body.title,
      ratings: req.body.ratings,
    });
    await calcAvgRatingsAndQuantity(review.product);
    await Promise.all([
      review.populate({ path: "user", select: "name email" }),
      review.populate({ path: "product", select: "title price" }),
    ]);

    res.status(200).json({
      success: true,
      review,
    });
  }
);

export const getAllReviews = getAll<{}, {}, {}, IReview>(Review, "Review");

export const getReview = getOne<{}, {}, {}, IReview>(Review, "Review");
export const updateReview = catchAsync(
  async (
    req: Request<reviewParams, {}, updateReviewBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const review = await Review.findOne({ _id: id });
    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }
    if (!isReviewMine(req, review.user)) {
      return next(new AppError("you allow only to update your review", 404));
    }
    if (req.body.title) review.title = req.body.title;
    if (req.body.ratings) review.ratings = req.body.ratings;
    await review.save();
    //to trigger post save middleware to calculate ratings avg
    if (req.body.ratings) {
      await calcAvgRatingsAndQuantity(review.product);
    }
    res.status(200).json({
      success: true,
      review,
    });
  }
);

export const deleteReview = catchAsync(
  async (req: Request<reviewParams>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }
    if (!isReviewMine(req, review.user)) {
      return next(new AppError("you allow only to delete your review", 404));
    }
    await review.deleteOne();
    //used for calculating rating and quantity after removing review with id
    await calcAvgRatingsAndQuantity(review.product);
    res.status(204).json({
      success: true,
    });
  }
);
