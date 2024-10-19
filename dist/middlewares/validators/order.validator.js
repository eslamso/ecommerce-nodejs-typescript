"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdValidator = exports.createPayTabsPaymentLinkValidator = void 0;
const express_validator_1 = require("express-validator");
const validator_middleWare_1 = __importDefault(require("./validator.middleWare"));
exports.createPayTabsPaymentLinkValidator = [
    (0, express_validator_1.param)("cartId").isMongoId().withMessage("invalid cartId"),
    validator_middleWare_1.default,
];
exports.orderIdValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("invalid Order id"),
    validator_middleWare_1.default,
];
