import { CategoryModel, ICategoryModel } from "../../models/categoryModel";
import { GenericRepository } from "../GenericRepository";
import { Model } from "mongoose";
import { ICategoryRepository } from "../../interfaces/ICategoryRepository";

export class CategoryRepository extends GenericRepository<ICategoryModel> implements ICategoryRepository {
  constructor() {
    super(CategoryModel);
  }

  async findCategoryByName(categoryName: string): Promise<ICategoryModel | null> {
    return this.findOne({ categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") } });
  }

  async listOrUnlistCategory(id: string): Promise<ICategoryModel | null> {
    const category = await this.findById(id);
    if (!category) throw new Error("No category found");

    return this.update(id, { isListed: !category.isListed });
  }
}