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
exports.payTabsWebHook = exports.intiPayTabs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const paytabs_pt2_1 = __importDefault(require("paytabs_pt2"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const appError_1 = __importDefault(require("../utils/appError"));
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
        callback: "https://webhook.site/44a2a603-0dbc-48cd-a01b-15b8529cc098",
        response: "https://webhook.site/44a2a603-0dbc-48cd-a01b-15b8529cc098",
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
    console.log(req.body);
    res.status(200).json({
        success: true,
        message: "webhook received",
    });
}));
