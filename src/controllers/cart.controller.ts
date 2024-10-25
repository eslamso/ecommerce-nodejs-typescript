import express from "express";

import { protect } from "../services/auth.services";
import {
  addProductToMyCartValidator,
  cartCouponValidator,
  updateCartProductQuantityValidator,
} from "../middlewares/validators/cart.validator";
import {
  addProductToMyCart,
  applyCoupon,
  getMyCart,
  removeCouponFromCart,
  removeMyCart,
  removeProductFromMyCart,
  updateCartProductQuantity,
} from "../services/cart.services";
const cartRouter = express.Router();
cartRouter.post(
  "/addProductToCart",
  protect,
  addProductToMyCartValidator,
  addProductToMyCart
);
cartRouter.post(
  "/removeProductFromCart",
  protect,
  addProductToMyCartValidator,
  removeProductFromMyCart
);
cartRouter.put(
  "/updateCartProductQuantity",
  protect,
  updateCartProductQuantityValidator,
  updateCartProductQuantity
);
cartRouter.put("/applyCouponToCart", protect, cartCouponValidator, applyCoupon);
cartRouter.put(
  "/removeCouponFromCart",
  protect,
  cartCouponValidator,
  removeCouponFromCart
);
cartRouter.delete("/deleteMyCart", protect, removeMyCart);
cartRouter.get("/getMyCart", protect, getMyCart);

export default cartRouter;
