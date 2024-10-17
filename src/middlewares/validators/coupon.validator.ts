import { RequestHandler } from "express";
import { body, param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import Coupon from "../../models/coupon.model";
export const createCouponValidator: RequestHandler[] = [
  body("name")
    .notEmpty()
    .withMessage("coupon must have name")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "coupon name must be at least 6 characters and at most 32 characters"
    )
    .custom(async (val) => {
      const coupon = await Coupon.findOne({ name: val });
      if (coupon) {
        throw new Error("coupon name is already exist");
      }
      return true;
    }),
  body("expiresIn")
    .notEmpty()
    .withMessage("coupon must have name")
    .isDate()
    .withMessage("expires must be Date"),
  body("discount")
    .notEmpty()
    .withMessage("coupon must have name")
    .isNumeric()
    .withMessage("discount must be number"),
  validatorMiddleWare,
];

export const updateCouponValidator: RequestHandler[] = [
  body("name")
    .optional()
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "coupon name must be at least 6 characters and at most 32 characters"
    )
    .custom(async (val) => {
      const coupon = await Coupon.findOne({ name: val });
      if (coupon) {
        throw new Error("coupon name is already exist");
      }
      return true;
    }),
  body("expiresIn").optional().isDate().withMessage("expires must be Date"),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("discount must be number"),
  param("id").isMongoId().withMessage("invalid CouponId"),

  validatorMiddleWare,
];

export const deleteCouponValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid couponId"),

  validatorMiddleWare,
];
