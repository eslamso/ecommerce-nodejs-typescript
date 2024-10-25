import { RequestHandler } from "express";
import { param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
export const createPayTabsPaymentLinkValidator: RequestHandler[] = [
  param("cartId").isMongoId().withMessage("invalid cartId"),
  validatorMiddleWare,
];

export const orderIdValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("invalid Order id"),
  validatorMiddleWare,
];
