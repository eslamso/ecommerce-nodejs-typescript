"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartCouponValidator = exports.updateCartProductQuantityValidator = exports.addProductToMyCartValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
exports.addProductToMyCartValidator = [
    (0, express_validator_1.body)("productId")
        .notEmpty()
        .withMessage("productId is required")
        .isMongoId()
        .withMessage("InValid Product Id"),
    validator_middleWare_1.default,
];
exports.updateCartProductQuantityValidator = [
    (0, express_validator_1.body)("productId")
        .notEmpty()
        .withMessage("productId is required")
        .isMongoId()
        .withMessage("InValid Product Id"),
    (0, express_validator_1.body)("quantity")
        .notEmpty()
        .withMessage("quantity is required")
        .isNumeric()
        .withMessage("quantity must be number"),
    validator_middleWare_1.default,
];
exports.cartCouponValidator = [
    (0, express_validator_1.body)("coupon")
        .notEmpty()
        .withMessage("coupon is required")
        .isString()
        .withMessage("coupon must be string"),
    validator_middleWare_1.default,
];
