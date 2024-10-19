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
exports.productIdValidator = exports.deleteProductValidator = exports.updateProductValidator = exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
exports.createProductValidator = [
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("product must have name")
        .isLength({ min: 6, max: 20 })
        .withMessage("product name must be at least 6 characters and at most 32 characters"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("product must have description")
        .isLength({ min: 10, max: 200 })
        .withMessage("product description must be at least 10 characters and at most 200 characters"),
    (0, express_validator_1.body)("price")
        .notEmpty()
        .withMessage("product must have price")
        .isNumeric()
        .withMessage("product price must be number"),
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("product must belong to category")
        .isMongoId()
        .withMessage("invalid categoryId")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_model_1.default.findById(val);
        if (!category) {
            throw new Error("no category found with that id");
        }
        return true;
    })),
    (0, express_validator_1.body)("quantity")
        .notEmpty()
        .withMessage("a product must have a quantity")
        .isNumeric()
        .withMessage("quantity must be a number"),
    (0, express_validator_1.body)("images").optional().isArray().withMessage("images must be an array"),
    (0, express_validator_1.body)("sold").optional().isNumeric().withMessage("sold must be a number"),
    (0, express_validator_1.body)("priceAfterDiscount")
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
    (0, express_validator_1.body)("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("ratingAverage must be a number")
        .isLength({ min: 1, max: 5 })
        .withMessage("ratingAverage must be between 1 and 5"),
    (0, express_validator_1.body)("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("ratingQuantity must be a number"),
    validator_middleWare_1.default,
];
exports.updateProductValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid ProductId"),
    (0, express_validator_1.body)("title")
        .optional()
        .isLength({ min: 6, max: 20 })
        .withMessage("product name must be at least 6 characters and at most 32 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ min: 10, max: 200 })
        .withMessage("product description must be at least 10 characters and at most 200 characters"),
    (0, express_validator_1.body)("price")
        .optional()
        .isNumeric()
        .withMessage("product price must be number"),
    (0, express_validator_1.body)("category")
        .optional()
        .isMongoId()
        .withMessage("invalid categoryId")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield product_model_1.default.findOne({ category: val });
        if (!category) {
            throw new Error("no category found with that id");
        }
        return true;
    })),
    (0, express_validator_1.body)("quantity")
        .optional()
        .isNumeric()
        .withMessage("quantity must be a number"),
    (0, express_validator_1.body)("images").optional().isArray().withMessage("images must be an array"),
    (0, express_validator_1.body)("sold").optional().isNumeric().withMessage("sold must be a number"),
    (0, express_validator_1.body)("priceAfterDiscount")
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
    (0, express_validator_1.body)("imageCover").optional(),
    (0, express_validator_1.body)("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("ratingAverage must be a number")
        .isLength({ min: 1, max: 5 })
        .withMessage("ratingAverage must be between 1 and 5"),
    (0, express_validator_1.body)("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("ratingQuantity must be a number"),
    validator_middleWare_1.default,
];
exports.deleteProductValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid productId"),
    validator_middleWare_1.default,
];
exports.productIdValidator = [
    (0, express_validator_1.param)("productId").isMongoId().withMessage("invalid productId"),
    validator_middleWare_1.default,
];
