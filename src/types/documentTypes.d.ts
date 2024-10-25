import { Document, Query, Types, Model, SchemaType } from "mongoose";
import { IUser } from "../models/user.model";
import { ICart } from "../models/cart.model";
export type mongoId = Types.ObjectId;

export type userDocument = IUser & Document;
export type cartDocument = ICart & Document;

export type mongooseQuery = Query<Document[], Document>;
export type mongooseModel = Model<Document>;
export interface IMongoInterface {
  [index: string]: any;
}
export type mongoDocument = IMongoInterface & Document;
