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
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getAllProducts = exports.createProduct = exports.resizeProductImage = exports.uploadProductImage = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uploadImage_middleWare_1 = require("../middlewares/uploadImage.middleWare");
const image_1 = require("../utils/image");
const handlerFactory_1 = require("../utils/handlerFactory");
exports.uploadProductImage = (0, uploadImage_middleWare_1.uploadSingleImage)("imageCover");
exports.resizeProductImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
        const productImageCoverName = (0, image_1.generateImageName)("product");
        const productImagePath = (0, image_1.imagePath)(productImageCoverName, "products");
        yield (0, image_1.sharpConfig)(req, [300, 300], 92, productImagePath);
        req.body.imageCover = (0, image_1.generateImageDBUrl)(productImageCoverName, "products");
    }
    next();
}));
exports.createProduct = (0, handlerFactory_1.createOne)(product_model_1.default, "product");
exports.getAllProducts = (0, handlerFactory_1.getAll)(product_model_1.default, "Product");
exports.getProduct = (0, handlerFactory_1.getOne)(product_model_1.default, "Product");
exports.updateProduct = (0, handlerFactory_1.updateOne)(product_model_1.default, "Product");
exports.deleteProduct = (0, handlerFactory_1.deleteOne)(product_model_1.default, "Product");
