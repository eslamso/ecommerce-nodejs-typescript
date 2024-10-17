"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCouponFromCart = exports.applyCoupon = exports.updateCartProductQuantity = exports.getMyCart = exports.removeMyCart = exports.removeProductFromMyCart = exports.addProductToMyCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const appError_1 = __importDefault(require("../utils/appError"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cart_1 = require("../utils/cart");
exports.addProductToMyCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { productId } = req.body;
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        return next(new appError_1.default("No product found with that ID", 404));
    }
    if (product.quantity < 1) {
        return next(new appError_1.default("This product is out of stock", 400));
    }
    let cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!cart) {
        cart = yield cart_model_1.default.create({
            cartItems: [{ product: productId, price: product.price }],
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        });
    }
    else {
        //2- if user has already cart and check if the product found on the cart or not
        // console.log("element added here");
        const productIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId.toString());
        if (productIndex > -1) {
            const item = cart.cartItems[productIndex];
            item.quantity += 1;
            cart.cartItems[productIndex] = item;
        }
        else {
            // element not found in the cart
            cart.cartItems.push({
                product: productId,
                price: product.price,
                quantity: 1,
            });
        }
    }
    yield (0, cart_1.calCartPrice)(cart);
    res.status(201).json({
        success: true,
        message: "product added to cart",
        cart,
    });
}));
exports.removeProductFromMyCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.body;
    const cart = yield cart_model_1.default.findOneAndUpdate({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, {
        //addToSet if id founded in set before added it not added again
        $pull: { cartItems: { _id: productId } },
    }, { new: true });
    if (!cart) {
        return next(new appError_1.default("no cart found", 404));
    }
    yield (0, cart_1.calCartPrice)(cart);
    res.status(200).json({
        success: true,
        cart,
    });
}));
exports.removeMyCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield cart_model_1.default.findOneAndDelete({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    if (!cart) {
        return next(new appError_1.default("no cart found", 404));
    }
    res.status(204).json({
        success: true,
    });
}));
exports.getMyCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    if (!cart) {
        return next(new appError_1.default("you don't have cart", 404));
    }
    res.status(200).json({
        success: true,
        cart,
    });
}));
exports.updateCartProductQuantity = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId, quantity } = req.body;
    const cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    if (!cart) {
        return next(new appError_1.default("no cart found", 404));
    }
    const productIndex = cart.cartItems.findIndex((item) => { var _a; return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) === productId.toString(); });
    if (productIndex === -1) {
        return next(new appError_1.default("item not found in cart", 404));
    }
    const item = cart.cartItems[productIndex];
    const product = yield product_model_1.default.findById(item.product);
    if (!product) {
        return next(new appError_1.default("product not found", 404));
    }
    if (quantity > product.quantity) {
        return next(new appError_1.default("quantity should not exceed the product's quantity", 400));
    }
    item.quantity = quantity;
    cart.cartItems[productIndex] = item;
    yield (0, cart_1.calCartPrice)(cart);
    res.status(200).json({
        success: true,
        cart,
    });
}));
exports.applyCoupon = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const coupon = yield coupon_model_1.default.findOne({
        name: req.body.coupon,
        expiresIn: { $gt: Date.now() },
    });
    //check if coupon is valid
    if (!coupon) {
        return next(new appError_1.default("coupon is not found or expired", 400));
    }
    const cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    if (!cart) {
        return next(new appError_1.default("no cart found", 404));
    }
    const totalAfterDiscount = (cart.totalCartPrice -
        (cart.totalCartPrice * coupon.discount) / 100).toFixed(2);
    cart.totalCartPriceAfterDiscount = Number(totalAfterDiscount);
    yield cart.save();
    res.status(200).json({
        success: true,
        message: "coupon applied successfully",
        cart,
    });
}));
exports.removeCouponFromCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const coupon = yield coupon_model_1.default.findOne({
        name: req.body.coupon,
    });
    //check if coupon is valid
    if (!coupon) {
        return next(new appError_1.default("the coupon is not found or expired", 400));
    }
    const cart = yield cart_model_1.default.findOneAndUpdate({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { $unset: { totalCartPriceAfterDiscount: undefined } }, { new: true });
    if (!cart) {
        return next(new appError_1.default("no cart found", 404));
    }
    res.status(200).json({
        success: true,
        message: "coupon is remove successfully",
        cart,
    });
}));
