"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    ratings: {
        type: Number,
        min: [1, "min val is 1"],
        max: [5, "max val is 5"],
        required: [true, "a review must have a rating"],
    },
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: [true, "a review must belong to a user"],
    },
    product: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Product",
        required: [true, "a review must belong to a product"],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Review", reviewSchema);
