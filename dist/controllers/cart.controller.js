"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_services_1 = require("../services/auth.services");
const cart_validator_1 = require("../middlewares/validators/cart.validator");
const cart_services_1 = require("../services/cart.services");
const cartRouter = express_1.default.Router();
cartRouter.post("/addProductToCart", auth_services_1.protect, cart_validator_1.addProductToMyCartValidator, cart_services_1.addProductToMyCart);
cartRouter.post("/removeProductFromCart", auth_services_1.protect, cart_validator_1.addProductToMyCartValidator, cart_services_1.removeProductFromMyCart);
cartRouter.put("/updateCartProductQuantity", auth_services_1.protect, cart_validator_1.updateCartProductQuantityValidator, cart_services_1.updateCartProductQuantity);
cartRouter.put("/applyCouponToCart", auth_services_1.protect, cart_validator_1.cartCouponValidator, cart_services_1.applyCoupon);
cartRouter.put("/removeCouponFromCart", auth_services_1.protect, cart_validator_1.cartCouponValidator, cart_services_1.removeCouponFromCart);
cartRouter.delete("/deleteMyCart", auth_services_1.protect, cart_services_1.removeMyCart);
cartRouter.get("/getMyCart", auth_services_1.protect, cart_services_1.getMyCart);
exports.default = cartRouter;
