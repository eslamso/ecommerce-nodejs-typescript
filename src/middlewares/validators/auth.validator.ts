import { body, param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import User from "../../models/user.model";
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ParamsDictionary,
} from "express-serve-static-core";
export const signUpValidator: RequestHandler[] = [
  body("name")
    .isLength({ min: 6, max: 32 })
    .withMessage("a name must be of length 6 ,above or 32"),
  body("email")
    .isEmail()
    .withMessage("invalid email format")
    .notEmpty()
    .withMessage("email is required")
    .custom(async (val: string, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email is already exist");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6, max: 32 })
    .withMessage("a password must be of length 6 ,above or 32")
    .custom((val: string, { req }) => {
      if (req.body.passwordConfirm !== val) {
        throw new Error("password and confirm password must be the same");
      }
      return true;
    }),
  validatorMiddleWare,
];

export const activateEmailValidator: RequestHandler[] = [
  body("code")
    .isString()
    .withMessage("a code must be string")
    .notEmpty()
    .withMessage("a code is required"),
  param("activationToken")
    .notEmpty()
    .withMessage("activationToken is required"),
  validatorMiddleWare,
];

export const logInValidator: RequestHandler[] = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
  validatorMiddleWare,
];

export const forgetPasswordValidator: RequestHandler[] = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email has incorrect format"),
  validatorMiddleWare,
];

export const verifyPasswordResetCodeValidator: RequestHandler[] = [
  body("code")
    .notEmpty()
    .withMessage("code is required")
    .isString()
    .withMessage("a code must be string"),
  validatorMiddleWare,
];

export const resetPasswordValidator: RequestHandler[] = [
  param("passwordResetToken").custom(async (val: string, { req }) => {
    const user = await User.findOne({
      passwordResetToken: val,
    });
    if (!user) {
      throw new Error("now user founded with that token");
    }
    return true;
  }),
  body("newPassword")
    .isLength({ min: 6, max: 32 })
    .withMessage("a password must be of length 6 ,above or 32")
    .custom((val: string, { req }) => {
      if (req.body.newPasswordConfirm !== val) {
        throw new Error("newPassword and newPasswordConfirm must be the same");
      }
      return true;
    }),
  validatorMiddleWare,
];
