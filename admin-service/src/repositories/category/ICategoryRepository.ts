import { ICategoryModel } from "../../models/categoryModel";
import { IGenericRepository } from "../GenericRepository";

export interface ICategoryRepository extends IGenericRepository<ICategoryModel> {
  findCategoryByName(categoryName: string): Promise<ICategoryModel | null>;
  listOrUnlistCategory(id: string): Promise<ICategoryModel | null>;
}