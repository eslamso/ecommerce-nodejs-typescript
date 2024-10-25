import sharp from "sharp";
import { Request } from "express";

export const generateImageName = (imagePrefix: string) =>
  `${imagePrefix}-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;

export const generateImageDBUrl = (
  imageName: string,
  dbCollectionName: string
) => `${process.env.BASE_URL}/uploads/${dbCollectionName}/${imageName}`;

export const imagePath = (imageName: string, dbCollectionName: string) =>
  `src/uploads/${dbCollectionName}/${imageName}`;
export const sharpConfig = async (
  req: Request,
  [x, y]: [number, number],
  quality: number,
  imagePath: string
) => {
  return await sharp(req.file?.buffer)
    .resize(x, y)
    .toFormat("jpeg")
    .jpeg({ quality })
    .toFile(imagePath);
};
