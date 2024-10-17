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
exports.sendingCodeToEmail = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const appError_1 = __importDefault(require("./appError"));
const generatingCode_1 = require("./generatingCode");
const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    const opt = {
        from: `E-shop <${process.env.GMAIL_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    yield transporter.sendMail(opt);
});
exports.sendMail = sendMail;
const sendingCodeToEmail = (user, subject, message, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.sendMail)({
            email: user.email,
            subject: subject,
            message: message,
        });
    }
    catch (err) {
        yield (0, generatingCode_1.resettingUserCodeFields)(user);
        return next(new appError_1.default(err.message, 400));
    }
});
exports.sendingCodeToEmail = sendingCodeToEmail;
