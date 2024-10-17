import mongoose, { Types } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  images?: string[];
  imageCover: string;
  sold?: number;
  quantity: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  priceAfterDiscount?: number;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "a product must have a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "a product must have a description"],
      minlength: [20, "description can not be less than 20 characters"],
    },
    price: {
      type: Number,
      required: [true, "a product must have a price"],
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [String],
    imageCover: String,
    priceAfterDiscount: Number,
    sold: Number,
    quantity: {
      type: Number,
      required: [true, "a product must have a quantity"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, "rating must be between 1 and 5"],
      max: [5, "rating must be between 1 and 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model<IProduct>("Product", productSchema);
