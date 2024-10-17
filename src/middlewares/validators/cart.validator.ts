import { RequestHandler } from "express";
import { body, param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import Cart from "../../models/cart.model";
export const addProductToMyCartValidator: RequestHandler[] = [
  body("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("InValid Product Id"),
  validatorMiddleWare,
];

export const updateCartProductQuantityValidator: RequestHandler[] = [
  body("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("InValid Product Id"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be number"),
  validatorMiddleWare,
];

export const cartCouponValidator: RequestHandler[] = [
  body("coupon")
    .notEmpty()
    .withMessage("coupon is required")
    .isString()
    .withMessage("coupon must be string"),

  validatorMiddleWare,
];
