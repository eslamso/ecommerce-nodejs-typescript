"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_services_1 = require("../services/product.services");
const auth_services_1 = require("../services/auth.services");
const product_validator_1 = require("../middlewares/validators/product.validator");
const settingFilters_middleWare_1 = require("../middlewares/settingFilters.middleWare");
const productRouter = express_1.default.Router();
productRouter
    .route("/")
    .post(auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), product_services_1.uploadProductImage, product_validator_1.createProductValidator, product_services_1.resizeProductImage, product_services_1.createProduct)
    .get(auth_services_1.protect, product_services_1.getAllProducts);
productRouter.put("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), product_services_1.uploadProductImage, product_validator_1.updateProductValidator, product_services_1.resizeProductImage, product_services_1.updateProduct);
productRouter.delete("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("manager", "admin"), product_validator_1.deleteProductValidator, product_services_1.deleteProduct);
productRouter.get("/reviews/:productId", auth_services_1.protect, product_validator_1.productIdValidator, settingFilters_middleWare_1.settingFilterObj, product_services_1.getAllReviewsOnProduct);
productRouter.get("/:id", auth_services_1.protect, product_validator_1.deleteProductValidator, product_services_1.getProduct);
exports.default = productRouter;
