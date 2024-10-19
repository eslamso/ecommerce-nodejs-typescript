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
exports.deleteReview = exports.updateReview = exports.getReview = exports.getAllReviews = exports.createReview = void 0;
const review_model_1 = __importDefault(require("../models/review.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
//import * as a from "../types/types";
const handlerFactory_1 = require("../utils/handlerFactory");
const appError_1 = __importDefault(require("../utils/appError"));
const aggregation_1 = require("../utils/aggregation");
exports.createReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const review = yield review_model_1.default.create({
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        product: req.body.product,
        title: req.body.title,
        ratings: req.body.ratings,
    });
    yield (0, aggregation_1.calcAvgRatingsAndQuantity)(review.product);
    yield Promise.all([
        review.populate({ path: "user", select: "name email" }),
        review.populate({ path: "product", select: "title price" }),
    ]);
    res.status(200).json({
        success: true,
        review,
    });
}));
exports.getAllReviews = (0, handlerFactory_1.getAll)(review_model_1.default, "Review");
exports.getReview = (0, handlerFactory_1.getOne)(review_model_1.default, "Review");
exports.updateReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield review_model_1.default.findOne({ _id: id });
    if (!review) {
        return next(new appError_1.default("No review found with that ID", 404));
    }
    if (!(0, aggregation_1.isReviewMine)(req, review.user)) {
        return next(new appError_1.default("you allow only to update your review", 404));
    }
    if (req.body.title)
        review.title = req.body.title;
    if (req.body.ratings)
        review.ratings = req.body.ratings;
    yield review.save();
    //to trigger post save middleware to calculate ratings avg
    if (req.body.ratings) {
        yield (0, aggregation_1.calcAvgRatingsAndQuantity)(review.product);
    }
    res.status(200).json({
        success: true,
        review,
    });
}));
exports.deleteReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield review_model_1.default.findById(id);
    if (!review) {
        return next(new appError_1.default("No review found with that ID", 404));
    }
    if (!(0, aggregation_1.isReviewMine)(req, review.user)) {
        return next(new appError_1.default("you allow only to delete your review", 404));
    }
    yield review.deleteOne();
    //used for calculating rating and quantity after removing review with id
    yield (0, aggregation_1.calcAvgRatingsAndQuantity)(review.product);
    res.status(204).json({
        success: true,
    });
}));
