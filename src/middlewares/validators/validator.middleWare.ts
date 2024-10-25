import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import AppError from "../../utils/appError";
import catchAsync from "express-async-handler";

const validatorMiddleWare: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError("validationErrors", 501, errors.array()));
    }
    next();
  }
);

export default validatorMiddleWare;
