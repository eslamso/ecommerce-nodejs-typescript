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
exports.resetPasswordValidator = exports.verifyPasswordResetCodeValidator = exports.forgetPasswordValidator = exports.logInValidator = exports.activateEmailValidator = exports.signUpValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
const user_model_1 = __importDefault(require("../../models/user.model"));
exports.signUpValidator = [
    (0, express_validator_1.body)("name")
        .isLength({ min: 6, max: 32 })
        .withMessage("a name must be of length 6 ,above or 32"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("invalid email format")
        .notEmpty()
        .withMessage("email is required")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const user = yield user_model_1.default.findOne({ email: val });
        if (user) {
            throw new Error("email is already exist");
        }
        return true;
    })),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6, max: 32 })
        .withMessage("a password must be of length 6 ,above or 32")
        .custom((val, { req }) => {
        if (req.body.passwordConfirm !== val) {
            throw new Error("password and confirm password must be the same");
        }
        return true;
    }),
    validator_middleWare_1.default,
];
exports.activateEmailValidator = [
    (0, express_validator_1.body)("code")
        .isString()
        .withMessage("a code must be string")
        .notEmpty()
        .withMessage("a code is required"),
    (0, express_validator_1.param)("activationToken")
        .notEmpty()
        .withMessage("activationToken is required"),
    validator_middleWare_1.default,
];
exports.logInValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email format"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("password is required"),
    validator_middleWare_1.default,
];
exports.forgetPasswordValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email has incorrect format"),
    validator_middleWare_1.default,
];
exports.verifyPasswordResetCodeValidator = [
    (0, express_validator_1.body)("code")
        .notEmpty()
        .withMessage("code is required")
        .isString()
        .withMessage("a code must be string"),
    validator_middleWare_1.default,
];
exports.resetPasswordValidator = [
    (0, express_validator_1.param)("passwordResetToken").custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const user = yield user_model_1.default.findOne({
            passwordResetToken: val,
        });
        if (!user) {
            throw new Error("now user founded with that token");
        }
        return true;
    })),
    (0, express_validator_1.body)("newPassword")
        .isLength({ min: 6, max: 32 })
        .withMessage("a password must be of length 6 ,above or 32")
        .custom((val, { req }) => {
        if (req.body.newPasswordConfirm !== val) {
            throw new Error("newPassword and newPasswordConfirm must be the same");
        }
        return true;
    }),
    validator_middleWare_1.default,
];
