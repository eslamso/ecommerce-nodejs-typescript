import { IProduct } from "../models/product.model";
import { Types } from "mongoose";
export interface createProductBody extends IProduct {}
export interface updateProductBody extends IProduct {}

export type productParams = { productId: string };
export interface getAllProductsQuery {
  title?: string;
  price?: number;
  category?: Types.ObjectId;
  sold?: number;
  quantity?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  priceAfterDiscount?: number;
}
