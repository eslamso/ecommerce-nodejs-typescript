import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";
import { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../utils/appError";
const storage = multer.memoryStorage();
const multerOption = () => {
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else cb(new AppError("only images is allowed"));
  };
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload;
};

export const uploadSingleImage = (fieldName: string) => {
  return multerOption().single(fieldName);
};

export const uploadImages = (fields?: multer.Field[]) =>
  multerOption().fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]);
