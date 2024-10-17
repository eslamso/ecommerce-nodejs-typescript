import { Request, Response, NextFunction } from "express";
import Product, { IProduct } from "../models/product.model";
import catchAsync from "express-async-handler";
import { uploadSingleImage } from "../middlewares/uploadImage.middleWare";
import {
  generateImageDBUrl,
  generateImageName,
  imagePath,
  sharpConfig,
} from "../utils/image";
import { createProductBody, getAllProductsQuery } from "../dtos/product.dto";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../utils/handlerFactory";
export const uploadProductImage = uploadSingleImage("imageCover");
export const resizeProductImage = catchAsync(
  async (req: Request<{}, {}>, res: Response, next: NextFunction) => {
    if (req.file?.buffer) {
      const productImageCoverName = generateImageName("product");
      const productImagePath = imagePath(productImageCoverName, "products");
      await sharpConfig(req, [300, 300], 92, productImagePath);
      req.body.imageCover = generateImageDBUrl(
        productImageCoverName,
        "products"
      );
    }
    next();
  }
);

export const createProduct = createOne<{}, createProductBody, {}, IProduct>(
  Product,
  "product"
);

export const getAllProducts = getAll<{}, {}, getAllProductsQuery, IProduct>(
  Product,
  "Product"
);
export const getProduct = getOne<{}, {}, {}, IProduct>(Product, "Product");

export const updateProduct = updateOne<{}, {}, {}, IProduct>(
  Product,
  "Product"
);

export const deleteProduct = deleteOne<{}, {}, {}, IProduct>(
  Product,
  "Product"
);
