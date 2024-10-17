"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
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
        },
    ],
    totalCartPrice: { type: Number, default: 0 },
    totalCartPriceAfterDiscount: { type: Number, default: 0 },
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Cart", cartSchema);
