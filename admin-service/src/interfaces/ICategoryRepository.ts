import { ICategoryModel } from "../models/categoryModel";
import { IGenericRepository } from "../repositories/GenericRepository";

export interface ICategoryRepository extends IGenericRepository<ICategoryModel> {
  findCategoryByName(categoryName: string): Promise<ICategoryModel | null>;
  listOrUnlistCategory(id: string): Promise<ICategoryModel | null>;
}