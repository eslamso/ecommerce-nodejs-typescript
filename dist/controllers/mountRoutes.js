"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("./user.controller"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const category_controller_1 = __importDefault(require("./category.controller"));
const product_controller_1 = __importDefault(require("./product.controller"));
const coupon_controller_1 = __importDefault(require("./coupon.controller"));
const cart_controller_1 = __importDefault(require("./cart.controller"));
const order_controller_1 = __importDefault(require("./order.controller"));
const mountRoutes = (app) => {
    app.use("/api/v1/user", user_controller_1.default);
    app.use("/api/v1/auth", auth_controller_1.default);
    app.use("/api/v1/category", category_controller_1.default);
    app.use("/api/v1/product", product_controller_1.default);
    app.use("/api/v1/coupon", coupon_controller_1.default);
    app.use("/api/v1/cart", cart_controller_1.default);
    app.use("/api/v1/order", order_controller_1.default);
};
exports.default = mountRoutes;
