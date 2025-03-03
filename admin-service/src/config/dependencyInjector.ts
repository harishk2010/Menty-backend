
import { ICategoryRepository } from "../interfaces/ICategoryRepository"
import { CategoryRepository } from "../repositories/category/categoryRepository"
import { ICategoryService } from "../interfaces/ICategoryService"
import { CategoryService } from "../services/category/categoryService"
import { ICategoryControllers } from "../interfaces/ICategoryContollers"
import { CategoryContoller } from "../controllers/category/categoryControllers"



const categoryRepository:ICategoryRepository=new CategoryRepository()
const categoryService:ICategoryService=new CategoryService(categoryRepository)
const categoryController:ICategoryControllers=new CategoryContoller(categoryService)

export { categoryController}