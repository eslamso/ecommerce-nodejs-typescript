"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("./user.controller"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const mountRoutes = (app) => {
    app.use("/api/v1/user", user_controller_1.default);
    app.use("/api/v1/auth", auth_controller_1.default);
};
exports.default = mountRoutes;
