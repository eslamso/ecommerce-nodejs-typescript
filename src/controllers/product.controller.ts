import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllReviewsOnProduct,
  getProduct,
  resizeProductImage,
  updateProduct,
  uploadProductImage,
} from "../services/product.services";
import { protect, restrictTo } from "../services/auth.services";
import {
  createProductValidator,
  deleteProductValidator,
  productIdValidator,
  updateProductValidator,
} from "../middlewares/validators/product.validator";
import { settingFilterObj } from "../middlewares/settingFilters.middleWare";
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
  "/reviews/:productId",
  protect,
  productIdValidator,
  settingFilterObj,
  getAllReviewsOnProduct
);

productRouter.get("/:id", protect, deleteProductValidator, getProduct);

export default productRouter;
