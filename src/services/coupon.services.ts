import Coupon, { ICoupon } from "../models/coupon.model";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../utils/handlerFactory";

export const createCoupon = createOne<{}, {}, {}, ICoupon>(Coupon, "Coupon");

export const getAllCoupons = getAll<{}, {}, {}, ICoupon>(Coupon, "coupon");

export const getCoupon = getOne<{}, {}, {}, ICoupon>(Coupon, "coupon");

export const updateCoupon = updateOne<{}, {}, {}, ICoupon>(Coupon, "coupon");

export const deleteCoupon = deleteOne<{}, {}, {}, ICoupon>(Coupon, "coupon");
