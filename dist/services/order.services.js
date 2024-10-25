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
exports.verifyReturnUrl = exports.updateOrderToDeliver = exports.getOneOrder = exports.getAllOrders = exports.paymentStatus = exports.payTabsWebHook = exports.createPayTabsPaymentLink = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const appError_1 = __importDefault(require("../utils/appError"));
const handlerFactory_1 = require("../utils/handlerFactory");
const payTabs_1 = require("../utils/payTabs");
exports.createPayTabsPaymentLink = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // 1- Setting paytabs configuration
    if (((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.addresses) === null || _b === void 0 ? void 0 : _b.length) == 0) {
        return next(new appError_1.default("User must have address", 400));
    }
    (0, payTabs_1.PayTabsSettings)();
    //2- get cart with cart Id
    const taxPrice = 0;
    const shippingPrice = 0;
    const myCart = yield cart_model_1.default.findById(req.params.cartId);
    if (!myCart) {
        return next(new appError_1.default("cart not found", 404));
    }
    //2-get price from cart and check if there is a coupon applied or not
    const cartPrice = myCart.totalCartPriceAfterDiscount
        ? myCart.totalCartPriceAfterDiscount
        : myCart.totalCartPrice;
    const totalCartPrice = cartPrice + taxPrice + shippingPrice;
    // 2- Initiating paytabs payments
    let paymentMethods = ["all"];
    let transaction = {
        type: "sale",
        class: "ecom",
    };
    let cart = {
        id: req.params.cartId,
        currency: "EGP",
        amount: totalCartPrice,
        description: "description perfecto",
    };
    let customer = {
        name: (_c = req.user) === null || _c === void 0 ? void 0 : _c.name,
        email: (_d = req.user) === null || _d === void 0 ? void 0 : _d.email,
        phone: (_e = req.user) === null || _e === void 0 ? void 0 : _e.phoneNumber,
        street1: (_f = req.user) === null || _f === void 0 ? void 0 : _f.addresses[0].alias,
        city: (_g = req.user) === null || _g === void 0 ? void 0 : _g.addresses[0].city,
        state: (_h = req.user) === null || _h === void 0 ? void 0 : _h.addresses[0].details,
        country: "EG",
        zip: (_j = req.user) === null || _j === void 0 ? void 0 : _j.addresses[0].postalCode,
    };
    let transaction_details = [
        transaction.type,
        transaction.class,
    ];
    let cart_details = [cart.id, cart.currency, cart.amount, cart.description];
    let customer_details = [
        customer.name,
        customer.email,
        customer.phone,
        customer.street1,
        customer.city,
        customer.state,
        customer.country,
        customer.zip,
    ];
    let shipping_address = customer_details;
    let url = {
        callback: "https://natoursapp-lu63.onrender.com/payTabsWebhook",
        response: "https://natoursapp-lu63.onrender.com/successPayment",
    };
    let response_URLs = [url.callback, url.response];
    let lang = "ar";
    let frameMode = true;
    // Wrap createPaymentPage in a Promise
    const createPaymentPage = (0, payTabs_1.createPayTabsPaymentPage)(paymentMethods, transaction_details, cart_details, customer_details, shipping_address, response_URLs, lang, frameMode);
    try {
        // Wait for payment page creation
        const result = yield createPaymentPage;
        // Respond with the result
        res.status(200).json({
            success: true,
            result,
        });
    }
    catch (error) {
        next(error); // Pass any errors to error-handling middleware
    }
}));
exports.payTabsWebHook = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // verify webhook signature
    const signatureVerification = (0, payTabs_1.verifyPayTabsWebHookSignature)(req);
    if (!signatureVerification) {
        return next(new appError_1.default("illegal attempt", 401));
    }
    console.log("hello from web hook");
    console.log(req.body);
    console.log("query:", req.query);
    console.log("params:", req.params);
    console.log("req.headers:", req.headers);
    const cart = yield cart_model_1.default.findById(req.body.cart_id);
    if (!cart) {
        return next(new appError_1.default("cart not found", 404));
    }
    console.log("cart", cart);
    const user = yield user_model_1.default.findOne({ email: req.body.customer_details.email });
    const status = req.body.payment_result.response_status;
    if (status === "A") {
        // Handle successful payment
        // logic here (e.g., update database)
        const price = req.body.cart_amount;
        const order = yield order_model_1.default.create({
            user: user._id,
            cartItems: cart.cartItems,
            totalOrderPrice: price,
            isPaid: true,
            PaidAt: Date.now(),
            paymentMethod: "online",
            shippingAddress: {
                city: req.body.shipping_details.city,
                details: req.body.shipping_details.street1,
                state: req.body.shipping_details.state,
                postalCode: req.body.shipping_details.zip,
            },
        });
        //console.log(cart, user, order);
        console.log("success payment".bgGreen);
        cart.cartItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield product_model_1.default.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity, sold: +item.quantity },
            });
        }));
        //5-remove cart
        yield cart_model_1.default.deleteOne({ _id: cart._id });
        res.status(200).json({
            success: true,
            message: "payment is created successfully",
        });
    }
}));
exports.paymentStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // verify webhook signature
    const signatureVerification = (0, payTabs_1.verifyPayTabsWebHookSignature)(req);
    if (!signatureVerification) {
        return next(new appError_1.default("illegal attempt", 401));
    }
    console.log("hello from web hook");
    console.log(req.body);
    console.log("query:", req.query);
    console.log("params:", req.params);
    console.log("req.headers:", req.headers);
    const cart = yield cart_model_1.default.findById(req.body.cart_id);
    if (!cart) {
        return next(new appError_1.default("cart not found", 404));
    }
    console.log("cart", cart);
    const user = yield user_model_1.default.findOne({ email: req.body.customer_details.email });
    const status = req.body.payment_result.response_status;
    if (status === "A") {
        // Handle successful payment
        // logic here (e.g., update database)
        const price = req.body.cart_amount;
        const order = yield order_model_1.default.create({
            user: user._id,
            cartItems: cart.cartItems,
            totalOrderPrice: price,
            isPaid: true,
            PaidAt: Date.now(),
            paymentMethod: "online",
            shippingAddress: {
                city: req.body.shipping_details.city,
                details: req.body.shipping_details.street1,
                state: req.body.shipping_details.state,
                postalCode: req.body.shipping_details.zip,
            },
        });
        //console.log(cart, user, order);
        console.log("success payment".bgGreen);
        cart.cartItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield product_model_1.default.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity, sold: +item.quantity },
            });
        }));
        //5-remove cart
        yield cart_model_1.default.deleteOne({ _id: cart._id });
        res.status(200).json({
            success: true,
            message: "payment is created successfully",
        });
    }
}));
exports.getAllOrders = (0, handlerFactory_1.getAll)(order_model_1.default, "Order");
exports.getOneOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let filter = {};
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "user") {
        filter = { user: req.user._id };
    }
    filter._id = req.params.id;
    const order = yield order_model_1.default.findOne(filter);
    if (!order) {
        return next(new appError_1.default("no order found with that id or that order not be long to you", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
}));
exports.updateOrderToDeliver = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findById(req.params.id);
    if (!order) {
        return next(new appError_1.default("no order found with that id", 404));
    }
    order.isDelivered = true;
    order.deliverAt = new Date();
    yield order.save();
    res.status(200).json({
        success: true,
        order,
    });
}));
exports.verifyReturnUrl = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello from verify return url");
    console.log("req.params", req.params);
    console.log("req.body", req.body);
    console.log("req.headers", req.headers);
    res.status(200).json({
        success: true,
        message: "Return url verified successfully",
    });
}));
