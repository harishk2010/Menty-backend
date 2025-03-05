
import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository"
import { CategoryRepository } from "../repositories/category/categoryRepository"
import { ICategoryService } from "../services/interfaces/ICategoryService"
import { CategoryService } from "../services/category/categoryService"
import { ICategoryControllers } from "../controllers/interfaces/ICategoryContollers"
import { CategoryContoller } from "../controllers/category/categoryControllers"



const categoryRepository:ICategoryRepository=new CategoryRepository()
const categoryService:ICategoryService=new CategoryService(categoryRepository)
const categoryController:ICategoryControllers=new CategoryContoller(categoryService)

export { categoryController}