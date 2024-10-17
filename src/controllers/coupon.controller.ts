import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from "../services/coupon.services";
import { protect, restrictTo } from "../services/auth.services";
import {
  createCouponValidator,
  deleteCouponValidator,
  updateCouponValidator,
} from "../middlewares/validators/coupon.validator";
const couponRouter = express.Router();
couponRouter
  .route("/")
  .post(
    protect,
    restrictTo("manager", "admin"),
    createCouponValidator,
    createCoupon
  )
  .get(protect, getAllCoupons);
couponRouter.put(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  updateCouponValidator,
  updateCoupon
);

couponRouter.delete(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  deleteCouponValidator,
  deleteCoupon
);

couponRouter.get("/:id", protect, restrictTo("manager", "admin"), getCoupon);
export default couponRouter;
