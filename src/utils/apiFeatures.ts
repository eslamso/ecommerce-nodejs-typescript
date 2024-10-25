import { QuerySelector } from "mongoose";
import { mongooseQuery } from "../types/documentTypes";
import { paginationObject, PublicObject, QueryObject } from "../types/types";

export class ApiFeatures {
  public pagination: paginationObject = {};
  constructor(public mongoQuery: mongooseQuery, public reqQuery: QueryObject) {}
  //method for filtering data
  filter() {
    const queryStringObj = { ...this.reqQuery };
    // delete these fields to using them in their unique places
    const exitingFields = ["page", "limit", "fields", "sort", "keyword"];
    exitingFields.forEach((field) => delete queryStringObj[field]);
    //covert query object to string
    let queryStr = JSON.stringify(queryStringObj);
    // applying filter using [gte, lte, gt, lt, ne]
    queryStr = queryStr.replace(
      /\b(gt|lt|gte|lte|ne)\b/g,
      (match) => `$${match}`
    );
    this.mongoQuery = this.mongoQuery.find(JSON.parse(queryStr));
    return this;
  }
  sorting() {
    if (this.reqQuery.sort) {
      const sortBy: string = this.reqQuery.sort.split(",").join(" ");
      //console.log(sortBy);
      this.mongoQuery = this.mongoQuery.sort(sortBy);
    } else {
      this.mongoQuery = this.mongoQuery.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.reqQuery.fields) {
      const fields: string = this.reqQuery.fields.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.select(fields);
    } else {
      this.mongoQuery = this.mongoQuery.select("-__v");
    }
    return this;
  }
  searching(modelName?: string) {
    if (this.reqQuery.keyword) {
      //for searching in different fields in the model
      const query: PublicObject = {};
      if (modelName === "product") {
        query.$or = [
          { title: { $regex: this.reqQuery.keyword, $options: "i" } },
          { description: { $regex: this.reqQuery.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.reqQuery.keyword, $options: "i" } },
        ];
      }
      this.mongoQuery = this.mongoQuery.find(query);
    }
    return this;
  }
  paginate(countDocuments: number) {
    const page: number = this.reqQuery.page ? Number(this.reqQuery.page) : 1;
    const limit = this.reqQuery.limit ? Number(this.reqQuery.limit) : 50;
    //console.log("limit", limit);
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination: paginationObject = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.previousPage = page - 1;
    }
    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);
    this.pagination = pagination;
    return this;
  }
}