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
exports.isReviewMine = exports.calcAvgRatingsAndQuantity = void 0;
const review_model_1 = __importDefault(require("../models/review.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const calcAvgRatingsAndQuantity = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield review_model_1.default.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: "product",
                    avgRating: { $avg: "$ratings" },
                    quantity: { $sum: 1 },
                },
            },
        ]);
        if (result.length > 0) {
            //console.log("result", result);
            yield product_model_1.default.findOneAndUpdate({ _id: productId }, {
                ratingsAverage: result[0].avgRating,
                ratingsQuantity: result[0].quantity,
            });
        }
        else {
            //console.log("result 2", result);
            yield product_model_1.default.findOneAndUpdate({ _id: productId }, {
                ratingsAverage: 0,
                ratingsQuantity: 0,
            });
        }
    });
};
exports.calcAvgRatingsAndQuantity = calcAvgRatingsAndQuantity;
const isReviewMine = (req, id) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) !== id.toString()) {
        return false;
    }
    return true;
};
exports.isReviewMine = isReviewMine;
