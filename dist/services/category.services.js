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
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.createCategory = exports.resizeCategoryImage = exports.uploadCategoryImage = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
//import * as a from "../types/types";
const sharp_1 = __importDefault(require("sharp"));
const uploadImage_middleWare_1 = require("../middlewares/uploadImage.middleWare");
const handlerFactory_1 = require("../utils/handlerFactory");
exports.uploadCategoryImage = (0, uploadImage_middleWare_1.uploadSingleImage)("profileImg");
exports.resizeCategoryImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
        // console.log("req.files", req.files.imageCover[0]);
        const categoryImageName = `category-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
        const imageDbUrl = `${process.env.BASE_URL}/uploads/categories/${categoryImageName}`;
        yield (0, sharp_1.default)(req.file.buffer)
            .resize(800, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`src/uploads/categories/${categoryImageName}`);
        req.body.image = imageDbUrl;
    }
    next();
}));
exports.createCategory = (0, handlerFactory_1.createOne)(category_model_1.default, "category");
exports.getAllCategories = (0, handlerFactory_1.getAll)(category_model_1.default, "category");
exports.getCategory = (0, handlerFactory_1.getOne)(category_model_1.default, "category");
exports.updateCategory = (0, handlerFactory_1.updateOne)(category_model_1.default, "category");
exports.deleteCategory = (0, handlerFactory_1.deleteOne)(category_model_1.default, "category");
