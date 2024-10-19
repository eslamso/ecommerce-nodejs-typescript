import express from "express";
import { protect, restrictTo } from "../services/auth.services";
import {
  getAllOrders,
  createPayTabsPaymentLink,
  getOneOrder,
  updateOrderToDeliver,
} from "../services/order.services";
import { createPayTabsPaymentLinkValidator } from "../middlewares/validators/order.validator";
import { findAllFilterObj } from "../utils/handlerFactory";
const orderRouter = express.Router();
orderRouter.post(
  "/:cartId",
  protect,
  createPayTabsPaymentLinkValidator,
  createPayTabsPaymentLink
);
orderRouter.get("/", protect, findAllFilterObj, getAllOrders);
orderRouter.get("/:id", protect, getOneOrder);
orderRouter.put(
  "/updateToDeliver/:id",
  protect,
  restrictTo("admin"),
  updateOrderToDeliver
);

export default orderRouter;
