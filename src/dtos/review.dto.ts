import { Types } from "mongoose";
import { IReview } from "../models/review.model";
import { mongoId } from "../types/documentTypes";

export type reviewParams = {
  id: string;
};

export interface createReviewBody {
  product: mongoId;
  title: string;
  ratings: number;
}
export interface updateReviewBody {
  title?: string;
  ratings?: number;
}
