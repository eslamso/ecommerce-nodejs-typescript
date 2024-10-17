"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "user must have a name"],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "user must have a email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "user must have a password"],
        minlength: [6, "password must have at least 8 characters"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordResetCodeVerified: Boolean,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "manager"],
    },
    profileImg: String,
    phoneNumber: String,
    active: {
        type: Boolean,
        default: true,
    },
    expireAt: {
        type: Date,
        index: { expireAfterSeconds: 10 },
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
