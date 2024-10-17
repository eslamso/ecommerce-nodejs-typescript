import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  resizeProductImage,
  updateProduct,
  uploadProductImage,
} from "../services/product.services";
import { protect, restrictTo } from "../services/auth.services";
import {
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} from "../middlewares/validators/product.validator";
const productRouter = express.Router();
productRouter
  .route("/")
  .post(
    protect,
    restrictTo("manager", "admin"),
    uploadProductImage,
    createProductValidator,
    resizeProductImage,
    createProduct
  )
  .get(protect, getAllProducts);
productRouter.put(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  uploadProductImage,
  updateProductValidator,
  resizeProductImage,
  updateProduct
);

productRouter.delete(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  deleteProductValidator,
  deleteProduct
);
productRouter.get(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  deleteProductValidator,
  getProduct
);
export default productRouter;
