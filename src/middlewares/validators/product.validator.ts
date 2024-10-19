import { RequestHandler } from "express";
import { body, param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import Product from "../../models/product.model";
import Category from "../../models/category.model";
export const createProductValidator: RequestHandler[] = [
  body("title")
    .notEmpty()
    .withMessage("product must have name")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "product name must be at least 6 characters and at most 32 characters"
    ),
  body("description")
    .notEmpty()
    .withMessage("product must have description")
    .isLength({ min: 10, max: 200 })
    .withMessage(
      "product description must be at least 10 characters and at most 200 characters"
    ),
  body("price")
    .notEmpty()
    .withMessage("product must have price")
    .isNumeric()
    .withMessage("product price must be number"),
  body("category")
    .notEmpty()
    .withMessage("product must belong to category")
    .isMongoId()
    .withMessage("invalid categoryId")
    .custom(async (val) => {
      const category = await Category.findById(val);
      if (!category) {
        throw new Error("no category found with that id");
      }
      return true;
    }),
  body("quantity")
    .notEmpty()
    .withMessage("a product must have a quantity")
    .isNumeric()
    .withMessage("quantity must be a number"),
  body("images").optional().isArray().withMessage("images must be an array"),
  body("sold").optional().isNumeric().withMessage("sold must be a number"),

  body("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("price after discount can not be greater than price");
      }
      return true;
    }),
  body("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("ratingAverage must be between 1 and 5"),
  body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number"),

  validatorMiddleWare,
];

export const updateProductValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid ProductId"),
  body("title")
    .optional()
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "product name must be at least 6 characters and at most 32 characters"
    ),
  body("description")
    .optional()
    .isLength({ min: 10, max: 200 })
    .withMessage(
      "product description must be at least 10 characters and at most 200 characters"
    ),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("product price must be number"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("invalid categoryId")
    .custom(async (val) => {
      const category = await Product.findOne({ category: val });
      if (!category) {
        throw new Error("no category found with that id");
      }
      return true;
    }),
  body("quantity")
    .optional()
    .isNumeric()
    .withMessage("quantity must be a number"),
  body("images").optional().isArray().withMessage("images must be an array"),
  body("sold").optional().isNumeric().withMessage("sold must be a number"),

  body("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("price after discount can not be greater than price");
      }
      return true;
    }),
  body("imageCover").optional(),
  body("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("ratingAverage must be between 1 and 5"),
  body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number"),

  validatorMiddleWare,
];

export const deleteProductValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid productId"),

  validatorMiddleWare,
];
export const productIdValidator: RequestHandler[] = [
  param("productId").isMongoId().withMessage("invalid productId"),

  validatorMiddleWare,
];
