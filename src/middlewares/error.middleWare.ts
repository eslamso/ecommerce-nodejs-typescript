import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
const devError = (err: AppError, res: Response) => {
  res.status(err.statusCode!).json({
    success: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const sendValidationError = (err: AppError, res: Response) => {
  res.status(err.statusCode!).json({
    message: err.message,
    errors: err.validatorErrors,
  });
};
const sendErrorProduction = (err: AppError, res: Response) => {
  res.status(err.statusCode!).json({
    success: err.status,
    message: err.message,
  });
};
export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  if (err.message === "validationErrors") {
    sendValidationError(err, res);
  } else if (process.env.NODE_ENV === "development") {
    devError(err, res);
  } else {
    sendErrorProduction(err, res);
  }
};
