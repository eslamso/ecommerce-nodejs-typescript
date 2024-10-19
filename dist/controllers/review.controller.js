"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_services_1 = require("../services/review.services");
const auth_services_1 = require("../services/auth.services");
const review_validator_1 = require("../middlewares/validators/review.validator");
const handlerFactory_1 = require("../utils/handlerFactory");
const reviewRouter = express_1.default.Router();
reviewRouter
    .route("/")
    .post(auth_services_1.protect, review_validator_1.createReviewBodyValidator, review_services_1.createReview)
    .get(auth_services_1.protect, handlerFactory_1.findAllFilterObj, review_services_1.getAllReviews);
reviewRouter.put("/:id", auth_services_1.protect, review_validator_1.updateReviewBodyValidator, review_services_1.updateReview);
reviewRouter.delete("/:id", auth_services_1.protect, review_validator_1.reviewIdValidator, review_services_1.deleteReview);
reviewRouter.get("/:id", auth_services_1.protect, review_validator_1.reviewIdValidator, review_services_1.getReview);
exports.default = reviewRouter;
