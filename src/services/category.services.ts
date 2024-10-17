import { Request, Response, NextFunction } from "express";
import Category, { ICategory } from "../models/category.model";
import catchAsync from "express-async-handler";
//import * as a from "../types/types";
import sharp from "sharp";
import {
  createCategoryBody,
  getAllCategoriesQuery,
} from "../dtos/category.dto";
import { uploadSingleImage } from "../middlewares/uploadImage.middleWare";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../utils/handlerFactory";
export const uploadCategoryImage = uploadSingleImage("profileImg");
export const resizeCategoryImage = catchAsync(
  async (
    req: Request<{}, {}, createCategoryBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.file?.buffer) {
      // console.log("req.files", req.files.imageCover[0]);
      const categoryImageName = `category-${Math.round(
        Math.random() * 1e9
      )}-${Date.now()}.jpeg`;
      const imageDbUrl = `${process.env.BASE_URL}/uploads/categories/${categoryImageName}`;
      await sharp(req.file.buffer)
        .resize(800, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`src/uploads/categories/${categoryImageName}`);
      req.body.image = imageDbUrl;
    }
    next();
  }
);

export const createCategory = createOne<{}, createCategoryBody, {}, ICategory>(
  Category,
  "category"
);

export const getAllCategories = getAll<
  {},
  {},
  getAllCategoriesQuery,
  ICategory
>(Category, "category");

export const getCategory = getOne<{}, {}, {}, ICategory>(Category, "category");

export const updateCategory = updateOne<{}, {}, {}, ICategory>(
  Category,
  "category"
);

export const deleteCategory = deleteOne<{}, {}, {}, ICategory>(
  Category,
  "category"
);
