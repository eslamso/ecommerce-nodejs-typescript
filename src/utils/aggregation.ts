import Review from "../models/review.model";
import Product from "../models/product.model";
import { mongoId } from "../types/documentTypes";
import { Request } from "express";

export const calcAvgRatingsAndQuantity = async function (productId: mongoId) {
  const result = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$ratings" },
        quantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    //console.log("result", result);
    await Product.findOneAndUpdate(
      { _id: productId },
      {
        ratingsAverage: result[0].avgRating,
        ratingsQuantity: result[0].quantity,
      }
    );
  } else {
    //console.log("result 2", result);

    await Product.findOneAndUpdate(
      { _id: productId },
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      }
    );
  }
};

export const isReviewMine = (req: Request, id: mongoId) => {
  if (req.user?._id!.toString() !== id.toString()) {
    return false;
  }
  return true;
};
