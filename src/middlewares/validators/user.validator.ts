import { RequestHandler } from "express";
import { body, param, check } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import User from "../../models/user.model";
import { isCorrectPassword } from "../../utils/password";
import Product from "../../models/product.model";

export const createUserValidator: RequestHandler[] = [
  check("name").notEmpty().withMessage("a User must have name"),
  check("email")
    .notEmpty()
    .withMessage("a User must have email")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email already exists");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("a password must be at least 8 and at most 32 characters"),

  check("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("invalid phone number format"),
  validatorMiddleWare,
];

export const updateUserValidator: RequestHandler[] = [
  body("name").optional().isString().withMessage("a name must be string "),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email already exists");
      }
      return true;
    }),

  check("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("invalid phone number format"),
  param("id").isMongoId().withMessage("invalid User id"),
  validatorMiddleWare,
];

export const deleteUserValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid User id"),
  validatorMiddleWare,
];

export const changeUserPasswordValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid User id"),
  body("password")
    .isLength({ min: 8, max: 32 })
    .withMessage("a password must be at least 8 and at most 32 characters"),
  validatorMiddleWare,
];

export const changeMyPasswordValidator: RequestHandler[] = [
  body("oldPassword")
    .notEmpty()
    .withMessage("old password is required")
    .custom(async (val, { req }) => {
      const isCorrect = await isCorrectPassword(val, req.user?.password!);
      if (!isCorrect) {
        throw new Error("old password is incorrect");
      }
      return true;
    }),
  body("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("a new password must be at least 8 and at most 32 characters")
    .custom(async (val, { req }) => {
      if (val !== req.body.newConfirmPassword) {
        throw new Error("new password and newConfirmPassword must be the same");
      }
      return true;
    }),
  validatorMiddleWare,
];

export const updateMeValidator: RequestHandler[] = [
  body("name").optional().isString().withMessage("a name must be string "),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email already exists");
      }
      return true;
    }),

  check("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("invalid phone number format"),
  validatorMiddleWare,
];

export const addProductToMyFavoritesValidator: RequestHandler[] = [
  param("productId")
    .isMongoId()
    .withMessage("invalid productId")
    .custom(async (val) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("product not found with that id");
      }
      return true;
    }),
  validatorMiddleWare,
];

export const addMyAddressValidator: RequestHandler[] = [
  body("alias")
    .isString()
    .withMessage("alias of address must be a string")
    .notEmpty()
    .withMessage("alias is required"),
  body("city")
    .isString()
    .withMessage("city of address must be a string")
    .notEmpty()
    .withMessage("city is required"),
  validatorMiddleWare,
];

export const myAddressValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid address id"),
  validatorMiddleWare,
];
