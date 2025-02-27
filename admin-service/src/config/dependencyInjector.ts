
import { ICategoryRepository } from "../repositories/category/ICategoryRepository"
import { CategoryRepository } from "../repositories/category/categoryRepository"
import { ICategoryService } from "../services/category/ICategoryService"
import { CategoryService } from "../services/category/categoryService"
import { ICategoryControllers } from "../controllers/category/ICategoryContollers"
import { CategoryContoller } from "../controllers/category/categoryControllers"



const categoryRepository:ICategoryRepository=new CategoryRepository()
const categoryService:ICategoryService=new CategoryService(categoryRepository)
const categoryController:ICategoryControllers=new CategoryContoller(categoryService)

export { categoryController}