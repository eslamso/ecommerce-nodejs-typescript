import express from "express";
import { protect } from "../services/auth.services";
import { intiPayTabs } from "../services/order.services";
const orderRouter = express.Router();
orderRouter.post("/:cartId", protect, intiPayTabs);
export default orderRouter;
