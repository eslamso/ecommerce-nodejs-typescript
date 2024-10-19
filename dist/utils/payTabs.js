"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayTabsWebHookSignature = exports.createPayTabsPaymentPage = exports.PayTabsSettings = void 0;
const crypto_1 = __importDefault(require("crypto"));
const paytabs_pt2_1 = __importDefault(require("paytabs_pt2"));
const PayTabsSettings = () => {
    let profileID = process.env.PROFILE_ID, serverKey = process.env.SERVER_KEY, region = process.env.REGION;
    paytabs_pt2_1.default.setConfig(profileID, serverKey, region);
};
exports.PayTabsSettings = PayTabsSettings;
const createPayTabsPaymentPage = (paymentMethods, transaction_details, cart_details, customer_details, shipping_address, response_URLs, lang, frameMode) => new Promise((resolve, reject) => {
    paytabs_pt2_1.default.createPaymentPage(paymentMethods, transaction_details, cart_details, customer_details, shipping_address, response_URLs, lang, function (results) {
        if (results.redirect_url) {
            resolve(results);
        }
        else {
            reject(new Error("Payment page creation failed"));
        }
    }, frameMode);
});
exports.createPayTabsPaymentPage = createPayTabsPaymentPage;
const verifyPayTabsWebHookSignature = (req) => {
    const signature = req.headers.signature;
    const data = req.body;
    const hash = crypto_1.default
        .createHmac("sha256", process.env.SERVER_KEY)
        .update(JSON.stringify(data))
        .digest("hex");
    return hash === signature;
};
exports.verifyPayTabsWebHookSignature = verifyPayTabsWebHookSignature;
