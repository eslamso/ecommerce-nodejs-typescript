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
exports.getMyAddresses = exports.removeMyAddress = exports.updateMyAddress = exports.addMyAddress = exports.removeProductToMyFavorites = exports.addProductToMyFavorites = exports.getMe = exports.updateMe = exports.changeMyPassword = exports.changeUserPassword = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.createUser = exports.resizeUserImage = exports.uploadUserImage = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
//import * as a from "../types/types";
const sharp_1 = __importDefault(require("sharp"));
const uploadImage_middleWare_1 = require("../middlewares/uploadImage.middleWare");
const handlerFactory_1 = require("../utils/handlerFactory");
const password_1 = require("../utils/password");
const appError_1 = __importDefault(require("../utils/appError"));
exports.uploadUserImage = (0, uploadImage_middleWare_1.uploadSingleImage)("profileImg");
exports.resizeUserImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
        // console.log("req.files", req.files.imageCover[0]);
        const userImageName = `user-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
        const imageDbUrl = `${process.env.BASE_URL}/uploads/users/${userImageName}`;
        yield (0, sharp_1.default)(req.file.buffer)
            .resize(800, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`src/uploads/users/${userImageName}`);
        req.body.profileImg = imageDbUrl;
    }
    next();
}));
exports.createUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email, profileImg } = req.body;
    const hashedPassword = yield (0, password_1.hashingPassword)(password);
    const user = yield user_model_1.default.create({
        name,
        password: hashedPassword,
        email,
        profileImg,
    });
    res.status(201).json({
        success: true,
        user,
    });
}));
exports.getAllUsers = (0, handlerFactory_1.getAll)(user_model_1.default, "User");
exports.getUser = (0, handlerFactory_1.getOne)(user_model_1.default, "User", {
    path: "myFavorites",
});
exports.updateUser = (0, handlerFactory_1.updateOne)(user_model_1.default, "User");
exports.deleteUser = (0, handlerFactory_1.deleteOne)(user_model_1.default, "User");
exports.changeUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password } = req.body;
    const user = yield user_model_1.default.findByIdAndUpdate(id, { password: yield (0, password_1.hashingPassword)(password) }, { new: true });
    if (!user) {
        return next(new appError_1.default("User not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "password updated successfully",
    });
}));
exports.changeMyPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { newPassword } = req.body;
    const user = yield user_model_1.default.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, {
        password: yield (0, password_1.hashingPassword)(newPassword),
        passwordChangedAt: Date.now(),
    }, {
        new: true,
    });
    res.status(200).json({
        success: true,
        message: "password updated successfully, please login again",
    });
}));
exports.updateMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, phoneNumber, profileImg } = req.body;
    const user = yield user_model_1.default.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, {
        name,
        email,
        phoneNumber,
        profileImg,
    }, {
        new: true,
    });
    res.status(200).json({
        success: true,
        user,
    });
}));
exports.getMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.populate({ path: "myFavorites" }));
    res.status(200).json({
        success: true,
        user,
    });
}));
exports.addProductToMyFavorites = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.params;
    const user = yield user_model_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, { $addToSet: { myFavorites: productId } }, { new: true });
    res.status(200).json({
        success: true,
        message: "Product added successfully to my favorites",
        user,
    });
}));
exports.removeProductToMyFavorites = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.params;
    const user = yield user_model_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, { $pull: { myFavorites: productId } }, { new: true });
    res.status(200).json({
        success: true,
        message: "Product removed successfully from my favorites",
        user,
    });
}));
exports.addMyAddress = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const address = req.body;
    const user = yield user_model_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, {
        //addToSet if id founded in set before added it not added again
        $addToSet: { addresses: address },
    }, { new: true });
    res.status(200).json({
        success: true,
        addresses: user === null || user === void 0 ? void 0 : user.addresses,
    });
}));
exports.updateMyAddress = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const data = req.body;
    // to transform req.body into "address.$.bodyAttribute" to fit with $set
    const transformedObject = Object.fromEntries(Object.entries(data).map(([key, value]) => {
        // Transform the key as needed
        const newKey = `addresses.$.${key}`;
        return [newKey, value];
    }));
    const user = yield user_model_1.default.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, "addresses._id": id }, {
        //addToSet if id founded in set before added it not added again
        $set: transformedObject,
    }, { new: true });
    console.log(req.body);
    res.status(200).json({
        success: true,
        message: "address is deleted successfully",
        addresses: user === null || user === void 0 ? void 0 : user.addresses,
    });
}));
exports.removeMyAddress = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const user = yield user_model_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, {
        //addToSet if id founded in set before added it not added again
        $pull: { addresses: { _id: id } },
    }, { new: true });
    res.status(200).json({
        success: true,
        addresses: user === null || user === void 0 ? void 0 : user.addresses,
    });
}));
exports.getMyAddresses = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    res.status(200).json({
        success: true,
        addresses: (_a = req.user) === null || _a === void 0 ? void 0 : _a.addresses,
    });
}));
