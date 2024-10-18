import express from "express";
import { protect, restrictTo } from "../services/auth.services";
import { getAllOrders, intiPayTabs } from "../services/order.services";
const orderRouter = express.Router();
orderRouter.post("/:cartId", protect, intiPayTabs);
orderRouter.get("/", protect, restrictTo("admin"), getAllOrders);

export default orderRouter;
