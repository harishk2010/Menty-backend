import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import { ICategoryModel } from "../../models/categoryModel";
import { CategoryRepository } from "../../repositories/category/categoryRepository";
import { ICategoryService } from "../interfaces/ICategoryService";

export class CategoryService implements ICategoryService {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async findCategoryByName(
    categoryName: string
  ): Promise<ICategoryModel | null> {
    return this.categoryRepository.findCategoryByName(categoryName);
  }

  async findCategoryById(categoryId: string): Promise<ICategoryModel | null> {
    return this.categoryRepository.findById(categoryId);
  }

  async addCategory(categoryName: string): Promise<ICategoryModel | null> {
    return this.categoryRepository.create({ categoryName });
  }

  async updateCategory(
    id: string,
    categoryName: string
  ): Promise<ICategoryModel | null> {
    return this.categoryRepository.update(id, { categoryName });
  }

  async getAllCategory(): Promise<ICategoryModel[]> {
    return this.categoryRepository.findAll();
  }

  async listOrUnlistCategory(id: string): Promise<ICategoryModel | null> {
    return this.categoryRepository.listOrUnlistCategory(id);
  }
}
