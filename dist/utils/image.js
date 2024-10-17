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
exports.sharpConfig = exports.imagePath = exports.generateImageDBUrl = exports.generateImageName = void 0;
const sharp_1 = __importDefault(require("sharp"));
const generateImageName = (imagePrefix) => `${imagePrefix}-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
exports.generateImageName = generateImageName;
const generateImageDBUrl = (imageName, dbCollectionName) => `${process.env.BASE_URL}/uploads/${dbCollectionName}/${imageName}`;
exports.generateImageDBUrl = generateImageDBUrl;
const imagePath = (imageName, dbCollectionName) => `src/uploads/${dbCollectionName}/${imageName}`;
exports.imagePath = imagePath;
const sharpConfig = (req_1, _a, quality_1, imagePath_1) => __awaiter(void 0, [req_1, _a, quality_1, imagePath_1], void 0, function* (req, [x, y], quality, imagePath) {
    var _b;
    return yield (0, sharp_1.default)((_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer)
        .resize(x, y)
        .toFormat("jpeg")
        .jpeg({ quality })
        .toFile(imagePath);
});
exports.sharpConfig = sharpConfig;
