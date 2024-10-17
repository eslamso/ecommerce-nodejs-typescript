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
exports.logOut = exports.resetPassword = exports.verifyPasswordResetCode = exports.resendResetCode = exports.forgetPassword = exports.restrictTo = exports.protect = exports.logIn = exports.resendActivationCode = exports.activateEmail = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = __importDefault(require("../utils/appError"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const email_1 = require("../utils/email");
const generatingCode_1 = require("../utils/generatingCode");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
exports.signUp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // hashing password before saving it in data base
    const hashedPassword = yield (0, password_1.hashingPassword)(password);
    //1- create user
    const newUser = yield user_model_1.default.create({
        name,
        email,
        password: hashedPassword,
    });
    console.log(req.body);
    //2- create activation code and token and email and send response
    yield (0, generatingCode_1.generateAndEmailCodeWithSendResponse)(newUser, res, next);
}));
exports.activateEmail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { activationToken } = req.params;
    const { code } = req.body;
    const hashActivationCode = (0, generatingCode_1.cryptoEncryption)(code);
    const user = yield user_model_1.default.findOne({
        activationToken: activationToken,
    });
    if (!user) {
        return next(new appError_1.default("user not found or token expired", 404));
    }
    if (user.activationCode != hashActivationCode ||
        user.activationCodeExpiresIn.getTime() < Date.now()) {
        return next(new appError_1.default("code is incorrect or expired", 400));
    }
    user.isActivated = true;
    (0, generatingCode_1.resettingUserCodeFields)(user);
    res.status(200).json({
        success: true,
        message: "email has been activated successfully, please login",
    });
}));
exports.resendActivationCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { activationToken } = req.params;
    const user = yield user_model_1.default.findOne({ activationToken: activationToken });
    if (!user) {
        return next(new appError_1.default("user belong to that token does not exist", 400));
    }
    const code = yield (0, generatingCode_1.generateAnotherActivationCode)(user);
    const subject = "email activation";
    const message = `your activation code is ${code}`;
    yield (0, email_1.sendingCodeToEmail)(user, subject, message, next);
    res.status(200).json({
        success: true,
        message: "code sent, please check your mail box",
    });
}));
exports.logIn = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(typeof req.query.limit, typeof req.query.page);
    const { email, password } = req.body;
    //1- find user by email
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return next(new appError_1.default("email or password is incorrect", 400));
    }
    //2- checking password correction
    const isPassCorrect = yield (0, password_1.isCorrectPassword)(password, user.password);
    if (!isPassCorrect) {
        return next(new appError_1.default("email or password is incorrect", 400));
    }
    // checking is email active
    if (!user.isActivated) {
        yield (0, generatingCode_1.generateAndEmailCodeWithSendResponse)(user, res, next);
    }
    else {
        //3- create access token
        const accessToken = (0, jwt_1.createAccessToken)(user._id);
        //4-sending cookies and response
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 day
        });
        res.status(200).json({
            success: true,
            user,
            accessToken,
        });
    }
}));
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[0];
    }
    else {
        token = req.cookies.accessToken;
    }
    if (!token) {
        return next(new appError_1.default("you are not logged in please login to access this route", 401));
    }
    let decoded;
    decoded = (0, jwt_1.verifyToken)(token);
    const user = yield user_model_1.default.findById(decoded.userId);
    if (!user) {
        return next(new appError_1.default("user belong to that token does not exist", 401));
    }
    if (user.passwordChangedAt) {
        const passChangedAtTimeStamp = parseInt(`${user.passwordChangedAt.getTime() / 1000}`, 10);
        if (passChangedAtTimeStamp > decoded.iat) {
            return next(new appError_1.default("password is changed please login again", 401));
        }
    }
    req.user = user; // for letting user to use protected routes
    next();
}));
const restrictTo = (...roles) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!roles.includes(req.user.role)) {
        return next(new appError_1.default("you do not have right to access this route ", 403));
    }
    next();
}));
exports.restrictTo = restrictTo;
exports.forgetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default("no user found with this email", 404));
    }
    const resetVerificationToken = yield (0, generatingCode_1.generateAndEmailPassResetCode)(user, next);
    res.status(200).json({
        success: true,
        resetVerificationToken,
    });
}));
exports.resendResetCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetActivationToken } = req.params;
    const user = yield user_model_1.default.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
        return next(new appError_1.default("user belong to that token does not exist", 400));
    }
    const code = yield (0, generatingCode_1.generateAnotherPassResetCode)(user);
    const subject = "password reset code";
    const message = `your password reset code is valid for (10 min) \n
    ${code}\n`;
    yield (0, email_1.sendingCodeToEmail)(user, subject, message, next);
    res.status(200).json({
        success: true,
        message: "reset code sent, please check your mail box",
    });
}));
exports.verifyPasswordResetCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const { resetActivationToken } = req.params;
    const user = yield user_model_1.default.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
        return next(new appError_1.default("no user founded with reset token", 404));
    }
    const hashedCode = (0, generatingCode_1.cryptoEncryption)(code);
    if (user.passwordResetCode != hashedCode ||
        user.passwordResetCodeExpires.getTime() < Date.now()) {
        return next(new appError_1.default("invalid or expired code", 400));
    }
    const passwordResetToken = yield (0, generatingCode_1.resetCodeVerified)(user);
    res.status(200).json({
        success: true,
        message: "code verified",
        passwordResetToken: passwordResetToken,
    });
}));
exports.resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { passwordResetToken } = req.params;
    const { newPassword } = req.body;
    const user = yield user_model_1.default.findOne({
        passwordResetToken,
    });
    if (!user) {
        return next(new appError_1.default("now user founded with that token", 404));
    }
    const hashedPassword = yield (0, password_1.hashingPassword)(newPassword);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date(Date.now());
    (0, generatingCode_1.resettingUserCodeFields)(user);
    res.status(200).json({
        success: true,
        message: "password reset successfully,please login",
    });
}));
exports.logOut = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.status(200).json({
        success: true,
        message: "logged out successfully",
    });
}));
