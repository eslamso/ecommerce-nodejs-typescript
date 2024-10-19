"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = require("express-rate-limit");
const mountRoutes_1 = __importDefault(require("./controllers/mountRoutes"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const error_middleWare_1 = require("./middlewares/error.middleWare");
const order_services_1 = require("./services/order.services");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.options("*", (0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "20Kb" }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.post("/payTabsWebhook", order_services_1.payTabsWebHook);
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
});
app.use(limiter);
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)());
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
