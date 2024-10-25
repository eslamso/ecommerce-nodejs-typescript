import { ICategory } from "../models/category.model";

export interface createCategoryBody extends ICategory {}
export interface updateCategoryBody extends ICategory {}
export type categoryParams = {
  categoryId: string;
};
export interface getAllCategoriesQuery {
  name?: string;
}
