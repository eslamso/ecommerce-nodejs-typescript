"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
    },
    cartItems: [
        {
            product: {
                type: mongoose_1.default.Schema.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
            price: Number,
            color: String,
        },
    ],
    tax: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    shippingAddress: {
        details: String,
        city: String,
        state: String,
        postalCode: String,
    },
    totalOrderPrice: Number,
    isPaid: {
        type: Boolean,
        default: false,
    },
    PaidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliverAt: Date,
    deliveryDate: {
        type: Number,
        default: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", orderSchema);
