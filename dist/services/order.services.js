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
exports.getOneOrder = exports.getAllOrders = exports.payTabsWebHook = exports.intiPayTabs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const paytabs_pt2_1 = __importDefault(require("paytabs_pt2"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const appError_1 = __importDefault(require("../utils/appError"));
const handlerFactory_1 = require("../utils/handlerFactory");
exports.intiPayTabs = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    // 1- Setting paytabs configuration
    let profileID = process.env.PROFILE_ID, serverKey = process.env.SERVER_KEY, region = process.env.REGION;
    paytabs_pt2_1.default.setConfig(profileID, serverKey, region);
    // 2- Initiating paytabs payments
    let paymentMethods = ["all"];
    let transaction = {
        type: "sale",
        class: "ecom",
    };
    //1- get cart with cart Id
    //app settings
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
    let cart = {
        id: req.params.cartId,
        currency: "EGP",
        amount: totalCartPrice,
        description: "description perfecto",
    };
    let customer = {
        name: (_a = req.user) === null || _a === void 0 ? void 0 : _a.name,
        email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email,
        phone: (_c = req.user) === null || _c === void 0 ? void 0 : _c.phoneNumber,
        street1: (_d = req.user) === null || _d === void 0 ? void 0 : _d.addresses[0].alias,
        city: (_e = req.user) === null || _e === void 0 ? void 0 : _e.addresses[0].city,
        state: (_f = req.user) === null || _f === void 0 ? void 0 : _f.addresses[0].details,
        country: "EG",
        zip: (_g = req.user) === null || _g === void 0 ? void 0 : _g.addresses[0].postalCode,
    };
    let transaction_details = [transaction.type, transaction.class];
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
        response: "https://natoursapp-lu63.onrender.com/payTabsWebhook",
    };
    let response_URLs = [url.callback, url.response];
    let lang = "ar";
    let frameMode = true;
    // Wrap createPaymentPage in a Promise
    const createPaymentPageAsync = () => new Promise((resolve, reject) => {
        paytabs_pt2_1.default.createPaymentPage(paymentMethods, transaction_details, cart_details, customer_details, shipping_address, response_URLs, lang, function (results) {
            if (results.redirect_url) {
                resolve(results);
            }
            else {
                reject(new Error("Payment page creation failed"));
            }
        }, frameMode);
    });
    try {
        // Wait for payment page creation
        const result = yield createPaymentPageAsync();
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
    console.log("hello from web hook");
    console.log(req.body);
    const cart = yield cart_model_1.default.findById(req.body.cart_id);
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
                city: req.body.shipping_address.city,
                details: req.body.shipping_address.street1,
                state: req.body.shipping_address.state,
                postalCode: req.body.shipping_address.zip,
            },
        });
        if (order) {
            cart.cartItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                yield product_model_1.default.findByIdAndUpdate(item.product, {
                    $inc: { quantity: -item.quantity, sold: +item.quantity },
                });
            }));
            //5-remove cart
            yield cart_model_1.default.deleteOne({ _id: cart._id });
        }
        res.status(200).json({
            success: true,
            message: "payment is created successfully",
        });
    }
    else {
        res.status(400).json({
            success: true,
            message: "payment is failed",
        });
    }
}));
exports.getAllOrders = (0, handlerFactory_1.getAll)(order_model_1.default, "Order");
exports.getOneOrder = (0, handlerFactory_1.getOne)(order_model_1.default, "Order");
