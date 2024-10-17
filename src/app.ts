import path from "path";
import express, { Request, Response, NextFunction, Express } from "express";
import cookieParser from "cookie-parser";
import mountRoutes from "./controllers/mountRoutes";
import { globalErrorHandler } from "./middlewares/error.middleWare";
import { payTabsWebHook } from "./services/order.services";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/payTabsWebhook", payTabsWebHook);
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
