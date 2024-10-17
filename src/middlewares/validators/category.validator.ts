import { RequestHandler } from "express";
import { body, param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import Category from "../../models/category.model";
export const createCategoryValidator: RequestHandler[] = [
  body("name")
    .notEmpty()
    .withMessage("category must have name")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "category name must be at least 6 characters and at most 32 characters"
    )
    .custom(async (val) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        throw new Error("category name is already exist");
      }
      return true;
    }),
  validatorMiddleWare,
];

export const updateCategoryValidator: RequestHandler[] = [
  body("name")
    .optional()
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "category name must be at least 6 characters and at most 32 characters"
    )
    .custom(async (val, { req }) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        throw new Error("category name is already exist");
      }
      return true;
    }),
  param("id").isMongoId().withMessage("invalid categoryId"),

  validatorMiddleWare,
];

export const deleteCategoryValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid categoryId"),

  validatorMiddleWare,
];
