import { ICategoryModel } from "../models/categoryModel";

export interface ICategoryService {
  findCategoryByName(categoryName: string): Promise<ICategoryModel | null>;
  findCategoryById(categoryId: string): Promise<ICategoryModel | null>;
  addCategory(categoryName: string): Promise<ICategoryModel | null>;
  updateCategory(id: string, categoryName: string): Promise<ICategoryModel | null>;
  getAllCategory(): Promise<ICategoryModel[]>;
  listOrUnlistCategory(id: string): Promise<ICategoryModel | null>;
}