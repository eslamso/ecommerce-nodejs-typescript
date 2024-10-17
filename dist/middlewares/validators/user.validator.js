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
exports.myAddressValidator = exports.addMyAddressValidator = exports.addProductToMyFavoritesValidator = exports.updateMeValidator = exports.changeMyPasswordValidator = exports.changeUserPasswordValidator = exports.deleteUserValidator = exports.updateUserValidator = exports.createUserValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const password_1 = require("../../utils/password");
const product_model_1 = __importDefault(require("../../models/product.model"));
exports.createUserValidator = [
    (0, express_validator_1.check)("name").notEmpty().withMessage("a User must have name"),
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("a User must have email")
        .isEmail()
        .withMessage("invalid email format")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const user = yield user_model_1.default.findOne({ email: val });
        if (user) {
            throw new Error("email already exists");
        }
        return true;
    })),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8, max: 32 })
        .withMessage("a password must be at least 8 and at most 32 characters"),
    (0, express_validator_1.check)("phoneNumber")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("invalid phone number format"),
    validator_middleWare_1.default,
];
exports.updateUserValidator = [
    (0, express_validator_1.body)("name").optional().isString().withMessage("a name must be string "),
    (0, express_validator_1.check)("email")
        .optional()
        .isEmail()
        .withMessage("invalid email format")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const user = yield user_model_1.default.findOne({ email: val });
        if (user) {
            throw new Error("email already exists");
        }
        return true;
    })),
    (0, express_validator_1.check)("phoneNumber")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("invalid phone number format"),
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid User id"),
    validator_middleWare_1.default,
];
exports.deleteUserValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid User id"),
    validator_middleWare_1.default,
];
exports.changeUserPasswordValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid User id"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8, max: 32 })
        .withMessage("a password must be at least 8 and at most 32 characters"),
    validator_middleWare_1.default,
];
exports.changeMyPasswordValidator = [
    (0, express_validator_1.body)("oldPassword")
        .notEmpty()
        .withMessage("old password is required")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        var _b;
        const isCorrect = yield (0, password_1.isCorrectPassword)(val, (_b = req.user) === null || _b === void 0 ? void 0 : _b.password);
        if (!isCorrect) {
            throw new Error("old password is incorrect");
        }
        return true;
    })),
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("new password is required")
        .isLength({ min: 8, max: 32 })
        .withMessage("a new password must be at least 8 and at most 32 characters")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        if (val !== req.body.newConfirmPassword) {
            throw new Error("new password and newConfirmPassword must be the same");
        }
        return true;
    })),
    validator_middleWare_1.default,
];
exports.updateMeValidator = [
    (0, express_validator_1.body)("name").optional().isString().withMessage("a name must be string "),
    (0, express_validator_1.check)("email")
        .optional()
        .isEmail()
        .withMessage("invalid email format")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const user = yield user_model_1.default.findOne({ email: val });
        if (user) {
            throw new Error("email already exists");
        }
        return true;
    })),
    (0, express_validator_1.check)("phoneNumber")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("invalid phone number format"),
    validator_middleWare_1.default,
];
exports.addProductToMyFavoritesValidator = [
    (0, express_validator_1.param)("productId")
        .isMongoId()
        .withMessage("invalid productId")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_model_1.default.findById(val);
        if (!product) {
            throw new Error("product not found with that id");
        }
        return true;
    })),
    validator_middleWare_1.default,
];
exports.addMyAddressValidator = [
    (0, express_validator_1.body)("alias")
        .isString()
        .withMessage("alias of address must be a string")
        .notEmpty()
        .withMessage("alias is required"),
    (0, express_validator_1.body)("city")
        .isString()
        .withMessage("city of address must be a string")
        .notEmpty()
        .withMessage("city is required"),
    validator_middleWare_1.default,
];
exports.myAddressValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid address id"),
    validator_middleWare_1.default,
];
