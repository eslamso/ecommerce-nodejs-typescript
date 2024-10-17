"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupon_services_1 = require("../services/coupon.services");
const auth_services_1 = require("../services/auth.services");
const coupon_validator_1 = require("../middlewares/validators/coupon.validator");
const couponRouter = express_1.default.Router();
couponRouter
    .route("/")
    .post(auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), coupon_validator_1.createCouponValidator, coupon_services_1.createCoupon)
    .get(auth_services_1.protect, coupon_services_1.getAllCoupons);
couponRouter.put("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), coupon_validator_1.updateCouponValidator, coupon_services_1.updateCoupon);
couponRouter.delete("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), coupon_validator_1.deleteCouponValidator, coupon_services_1.deleteCoupon);
couponRouter.get("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), coupon_services_1.getCoupon);
exports.default = couponRouter;
