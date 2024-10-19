"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewIdValidator = exports.updateReviewBodyValidator = exports.createReviewBodyValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
const product_model_1 = __importDefault(require("../../models/product.model"));
exports.createReviewBodyValidator = [
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
    (0, express_validator_1.body)("product")
        .notEmpty()
        .withMessage("product is required")
        .isMongoId()
        .withMessage("invalid product Id")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const product = yield product_model_1.default.findById(val);
        if (!product) {
            throw new Error("product not found with that id");
        }
        return true;
    })),
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("title is required")
        .isString()
        .withMessage("title must be a string")
        .isLength({ min: 1, max: 100 })
        .withMessage("title must be at least 1 and at most 100 characters"),
    (0, express_validator_1.body)("ratings")
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
    validator_middleWare_1.default,
];
exports.updateReviewBodyValidator = [
    (0, express_validator_1.body)("title")
        .optional()
        .isString()
        .withMessage("title must be a string")
        .isLength({ min: 1, max: 100 })
        .withMessage("title must be at least 1 and at most 100 characters"),
    (0, express_validator_1.body)("ratings")
        .optional()
        .isNumeric()
        .withMessage("ratings must be a number")
        .custom((val) => {
        if (val < 1 || val > 5) {
            throw new Error("ratings must be between 1 and 5");
        }
        return true;
    }),
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid review id"),
    validator_middleWare_1.default,
];
exports.reviewIdValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid review id"),
    validator_middleWare_1.default,
];
