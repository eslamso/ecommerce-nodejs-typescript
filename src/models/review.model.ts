import mongoose, { Types } from "mongoose";
export interface IReview {
  title: string;
  ratings: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "min val is 1"],
      max: [5, "max val is 5"],
      required: [true, "a review must have a rating"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "a review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "a review must belong to a product"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
