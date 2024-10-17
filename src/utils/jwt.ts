import jwt, { JwtPayload } from "jsonwebtoken";
import { mongoId } from "../types/documentTypes";
import { NextFunction } from "express";
import AppError from "./appError";
export const createAccessToken = (payload: mongoId) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  decoded = jwt.verify(token, process.env.JWT_SECRET!);
  return decoded as JwtPayload;
};
