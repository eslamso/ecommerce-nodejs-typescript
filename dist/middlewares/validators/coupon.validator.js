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
exports.deleteCouponValidator = exports.updateCouponValidator = exports.createCouponValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
const coupon_model_1 = __importDefault(require("../../models/coupon.model"));
exports.createCouponValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("coupon must have name")
        .isLength({ min: 6, max: 20 })
        .withMessage("coupon name must be at least 6 characters and at most 32 characters")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield coupon_model_1.default.findOne({ name: val });
        if (coupon) {
            throw new Error("coupon name is already exist");
        }
        return true;
    })),
    (0, express_validator_1.body)("expiresIn")
        .notEmpty()
        .withMessage("coupon must have name")
        .isDate()
        .withMessage("expires must be Date"),
    (0, express_validator_1.body)("discount")
        .notEmpty()
        .withMessage("coupon must have name")
        .isNumeric()
        .withMessage("discount must be number"),
    validator_middleWare_1.default,
];
exports.updateCouponValidator = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 6, max: 20 })
        .withMessage("coupon name must be at least 6 characters and at most 32 characters")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield coupon_model_1.default.findOne({ name: val });
        if (coupon) {
            throw new Error("coupon name is already exist");
        }
        return true;
    })),
    (0, express_validator_1.body)("expiresIn").optional().isDate().withMessage("expires must be Date"),
    (0, express_validator_1.body)("discount")
        .optional()
        .isNumeric()
        .withMessage("discount must be number"),
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid CouponId"),
    validator_middleWare_1.default,
];
exports.deleteCouponValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid couponId"),
    validator_middleWare_1.default,
];
