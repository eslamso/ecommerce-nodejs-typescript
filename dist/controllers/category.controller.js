"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_services_1 = require("../services/category.services");
const auth_services_1 = require("../services/auth.services");
const category_validator_1 = require("../middlewares/validators/category.validator");
const categoryRouter = express_1.default.Router();
categoryRouter
    .route("/")
    .post(auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), category_services_1.uploadCategoryImage, category_validator_1.createCategoryValidator, category_services_1.resizeCategoryImage, category_services_1.createCategory)
    .get(auth_services_1.protect, category_services_1.getAllCategories);
categoryRouter.put("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), category_services_1.uploadCategoryImage, category_validator_1.updateCategoryValidator, category_services_1.resizeCategoryImage, category_services_1.updateCategory);
categoryRouter.delete("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), category_validator_1.deleteCategoryValidator, category_services_1.deleteCategory);
categoryRouter.get("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), category_services_1.getCategory);
exports.default = categoryRouter;
