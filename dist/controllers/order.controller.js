"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_services_1 = require("../services/auth.services");
const order_services_1 = require("../services/order.services");
const orderRouter = express_1.default.Router();
orderRouter.post("/:cartId", auth_services_1.protect, order_services_1.intiPayTabs);
exports.default = orderRouter;
