"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyReturnUrlBody = exports.verifyPayTabsWebHookSignature = exports.createPayTabsPaymentPage = exports.PayTabsSettings = void 0;
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
const verifyReturnUrlBody = (req) => {
    const serverKey = "SWJ9NMMG69-JK22K96Z9J-W2DJJGHJTL";
    // Mocked raw content received from PayTabs
    const rawData = req.body;
    // Step 1: Remove 'signature' from the data
    const { signature } = rawData, dataWithoutSignature = __rest(rawData, ["signature"]);
    // Step 2: Remove empty parameters
    const filteredData = Object.fromEntries(Object.entries(dataWithoutSignature).filter(([_, value]) => value !== ""));
    // Step 3: Sort parameters by keys
    const sortedData = Object.keys(filteredData)
        .sort()
        .reduce((acc, key) => {
        acc[key] = filteredData[key];
        return acc;
    }, {});
    // Step 4: Convert sorted parameters to query string format
    const queryString = Object.entries(sortedData)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    // Step 5: Generate the HMAC SHA256 hash using the server key
    const hash = crypto_1.default
        .createHmac("sha256", serverKey)
        .update(queryString)
        .digest("hex");
    // Step 6: Compare the generated hash with the received signature
    return hash === signature;
};
exports.verifyReturnUrlBody = verifyReturnUrlBody;
