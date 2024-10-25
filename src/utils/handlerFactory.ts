import catchAsync from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { ApiFeatures } from "./apiFeatures";
import { Model } from "mongoose";
import {
  populationOpt,
  PublicBody,
  PublicParams,
  QueryObject,
} from "../types/types";
import AppError from "./appError";
import { mongoDocument } from "../types/documentTypes";
export const createOne = <P, B, Q, T>(Model: Model<T>, modelName: string) =>
  catchAsync(
    async (req: Request<P, {}, B, Q>, res: Response, next: NextFunction) => {
      const doc = await Model.create(req.body);
      res.status(201).json({
        success: true,
        doc,
      });
    }
  );

export const getAll = <P, B, Q extends QueryObject, T>(
  Model: Model<T>,
  modelName: string
) =>
  catchAsync(
    async (req: Request<P, {}, B, Q>, res: Response, next: NextFunction) => {
      //console.log(process.env.NODE_ENV);
      let filter = {};
      if (req.filterObj) filter = req.filterObj;
      const docsCount = await Model.countDocuments();
      const query = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .paginate(docsCount)
        .sorting()
        .limitFields()
        .searching(modelName);
      //2) consume query
      const { mongoQuery, pagination } = query;
      const docs = await mongoQuery;
      res.status(200).json({
        success: true,
        results: docs.length,
        docs,
        pagination,
      });
    }
  );

export const getOne = <P extends PublicParams, B, Q, T>(
  Model: Model<T>,
  modelName: string,
  populateOpt?: populationOpt
) =>
  catchAsync(
    async (req: Request<P, {}, B, Q>, res: Response, next: NextFunction) => {
      const { id } = req.params;
      let query = Model.findById(id);
      let doc: mongoDocument | null = await query;
      if (!doc) {
        return next(
          new AppError(
            `no ${modelName.toLocaleLowerCase()} found with that id`,
            404
          )
        );
      }
      if (populateOpt) {
        doc = await doc.populate(populateOpt);
      }
      res.status(200).json({
        success: true,
        doc,
      });
    }
  );

export const updateOne = <P extends PublicParams, B extends PublicBody, Q, T>(
  Model: Model<T>,
  modelName: string
) =>
  catchAsync(
    async (req: Request<P, {}, B, Q>, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const doc = await Model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      if (!doc) {
        return next(
          new AppError(
            `No ${modelName.toLocaleLowerCase()} found with that ID`,
            404
          )
        );
      }
      res.status(200).json({
        success: true,
        doc,
      });
    }
  );

export const deleteOne = <P extends PublicParams, B extends PublicBody, Q, T>(
  Model: Model<T>,
  modelName: string
) =>
  catchAsync(
    async (req: Request<P, {}, B, Q>, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const doc = await Model.findByIdAndDelete(id);
      if (!doc) {
        return next(
          new AppError(
            `No ${modelName.toLocaleLowerCase()} found with that ID`,
            404
          )
        );
      }
      res.status(204).json({
        success: true,
      });
    }
  );
export const findAllFilterObj = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === "user") req.filterObj = { user: req.user.id };
    next();
  }
);
