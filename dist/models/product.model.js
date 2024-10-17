"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "a product must have a title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "a product must have a description"],
        minlength: [20, "description can not be less than 20 characters"],
    },
    price: {
        type: Number,
        required: [true, "a product must have a price"],
    },
    category: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Category",
        required: true,
    },
    images: [String],
    imageCover: String,
    priceAfterDiscount: Number,
    sold: Number,
    quantity: {
        type: Number,
        required: [true, "a product must have a quantity"],
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [1, "rating must be between 1 and 5"],
        max: [5, "rating must be between 1 and 5"],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.default = mongoose_1.default.model("Product", productSchema);
