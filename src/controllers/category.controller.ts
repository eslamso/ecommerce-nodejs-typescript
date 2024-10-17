import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  resizeCategoryImage,
  updateCategory,
  uploadCategoryImage,
} from "../services/category.services";
import { protect, restrictTo } from "../services/auth.services";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} from "../middlewares/validators/category.validator";
const categoryRouter = express.Router();
categoryRouter
  .route("/")
  .post(
    protect,
    restrictTo("manager", "admin"),
    uploadCategoryImage,
    createCategoryValidator,
    resizeCategoryImage,
    createCategory
  )
  .get(protect, getAllCategories);
categoryRouter.put(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  uploadCategoryImage,
  updateCategoryValidator,
  resizeCategoryImage,
  updateCategory
);

categoryRouter.delete(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  deleteCategoryValidator,
  deleteCategory
);

categoryRouter.get(
  "/:id",
  protect,
  restrictTo("manager", "admin"),
  getCategory
);
export default categoryRouter;
