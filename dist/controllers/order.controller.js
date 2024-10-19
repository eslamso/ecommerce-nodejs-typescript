"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_services_1 = require("../services/auth.services");
const order_services_1 = require("../services/order.services");
const order_validator_1 = require("../middlewares/validators/order.validator");
const handlerFactory_1 = require("../utils/handlerFactory");
const orderRouter = express_1.default.Router();
orderRouter.post("/:cartId", auth_services_1.protect, order_validator_1.createPayTabsPaymentLinkValidator, order_services_1.createPayTabsPaymentLink);
orderRouter.get("/", auth_services_1.protect, handlerFactory_1.findAllFilterObj, order_services_1.getAllOrders);
orderRouter.get("/:id", auth_services_1.protect, order_services_1.getOneOrder);
orderRouter.put("/updateToDeliver/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("admin"), order_services_1.updateOrderToDeliver);
exports.default = orderRouter;
