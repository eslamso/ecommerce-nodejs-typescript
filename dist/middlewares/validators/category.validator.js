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
exports.deleteCategoryValidator = exports.updateCategoryValidator = exports.createCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
const category_model_1 = __importDefault(require("../../models/category.model"));
exports.createCategoryValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("category must have name")
        .isLength({ min: 6, max: 20 })
        .withMessage("category name must be at least 6 characters and at most 32 characters")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_model_1.default.findOne({ name: val });
        if (category) {
            throw new Error("category name is already exist");
        }
        return true;
    })),
    validator_middleWare_1.default,
];
exports.updateCategoryValidator = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 6, max: 20 })
        .withMessage("category name must be at least 6 characters and at most 32 characters")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const category = yield category_model_1.default.findOne({ name: val });
        if (category) {
            throw new Error("category name is already exist");
        }
        return true;
    })),
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid categoryId"),
    validator_middleWare_1.default,
];
exports.deleteCategoryValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid categoryId"),
    validator_middleWare_1.default,
];
