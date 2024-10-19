import { PopulateOptions } from "mongoose";
declare global {
  namespace Express {
    interface Request {
      filterObj?: PublicObject;
    }
  }
}

export interface QueryObject {
  [index: string]: any;
  page?: string;
  limit?: string;
  sort?: string;
  keyword?: string;
  fields?: string;
}

export interface PublicObject {
  [index: string]: any;
}

export interface paginationObject {
  page?: number;
  limit?: number;
  numberOfPages?: number;
  currentPage?: number;
  nextPage?: number;
  previousPage?: number;
}

export type PublicParams = {
  [index: string]: any;
};

export interface PublicBody {
  [index: string]: any;
}
export type populationOpt = PopulateOptions | (PopulateOptions | string[]);
