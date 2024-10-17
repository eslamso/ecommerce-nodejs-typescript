import { Express } from "express";
import userRouter from "./user.controller";
import authRouter from "./auth.controller";
import categoryRouter from "./category.controller";
import productRouter from "./product.controller";
import couponRouter from "./coupon.controller";
import cartRouter from "./cart.controller";
import orderRouter from "./order.controller";
const mountRoutes = (app: Express) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/coupon", couponRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/order", orderRouter);
};

export default mountRoutes;
