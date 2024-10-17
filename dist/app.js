"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mountRoutes_1 = __importDefault(require("./controllers/mountRoutes"));
const error_middleWare_1 = require("./middlewares/error.middleWare");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//mount routes
(0, mountRoutes_1.default)(app);
app.all("*", (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `cant find ${req.url}`,
    });
});
app.use(error_middleWare_1.globalErrorHandler);
exports.default = app;
