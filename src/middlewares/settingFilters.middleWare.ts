import { Request, Response, NextFunction } from "express";
import catchAsync from "express-async-handler";
export const settingFilterObj = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filterObj = { product: req.params.productId };
    req.filterObj = filterObj;
    next();
  }
);
