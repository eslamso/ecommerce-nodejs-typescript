import { RequestHandler } from "express";
import { body, param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import Product from "../../models/product.model";
export const createReviewBodyValidator: RequestHandler[] = [
  // body("user")
  //   .optional()
  //   .isMongoId()
  //   .withMessage("invalid user Id")
  //   .custom((val, { req }) => {
  //     if (req.user.id !== val) {
  //       throw new Error(
  //         "please be yourself , you only allowed to create review for yourself"
  //       );
  //     }
  //     req.body.user = req.user.id;
  //     return true;
  //   }),
  body("product")
    .notEmpty()
    .withMessage("product is required")
    .isMongoId()
    .withMessage("invalid product Id")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("product not found with that id");
      }
      return true;
    }),
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("title must be at least 1 and at most 100 characters"),
  body("ratings")
    .notEmpty()
    .withMessage("ratings is required")
    .isNumeric()
    .withMessage("ratings must be a number")
    .custom((val) => {
      if (val < 1 || val > 5) {
        throw new Error("ratings must be between 1 and 5");
      }
      return true;
    }),
  validatorMiddleWare,
];

export const updateReviewBodyValidator: RequestHandler[] = [
  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("title must be at least 1 and at most 100 characters"),
  body("ratings")
    .optional()
    .isNumeric()
    .withMessage("ratings must be a number")
    .custom((val) => {
      if (val < 1 || val > 5) {
        throw new Error("ratings must be between 1 and 5");
      }
      return true;
    }),

  param("id").isMongoId().withMessage("invalid review id"),
  validatorMiddleWare,
];

export const reviewIdValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid review id"),
  validatorMiddleWare,
];
