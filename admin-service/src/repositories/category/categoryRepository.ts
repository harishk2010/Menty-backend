
import { ICategoryBaseRepository } from "../baseRepository/category/ICategoryBaseRepository";
import { CategoryBaseRepository } from "../baseRepository/category/categoryBaseRepository";
import { ICategoryRepository } from "./ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
    private categoryBaseRepository:ICategoryBaseRepository
    constructor(categoryBaseRepository:ICategoryBaseRepository){
        this.categoryBaseRepository=categoryBaseRepository
    }

}