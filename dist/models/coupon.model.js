"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "a coupon must have name"],
        unique: true,
        trim: true,
    },
    expiresIn: {
        type: Date,
        required: [true, "a coupon must have an expiration date"],
    },
    discount: {
        type: Number,
        required: [true, "a coupon must have a discount percentage"],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Coupon", couponSchema);
