import path from "path";
import express, { Request, Response, NextFunction, Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import mountRoutes from "./controllers/mountRoutes";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import { globalErrorHandler } from "./middlewares/error.middleWare";
import { payTabsWebHook } from "./services/order.services";

const app = express();
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "20Kb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/payTabsWebhook", payTabsWebHook);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
});
app.use(limiter);
app.use(mongoSanitize());
app.use(hpp());
app.use(helmet());
//mount routes
mountRoutes(app);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `cant find ${req.url}`,
  });
});

app.use(globalErrorHandler);

export default app;
