
import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository"
import { CategoryRepository } from "../repositories/category/categoryRepository"
import { ICategoryService } from "../services/interfaces/ICategoryService"
import { CategoryService } from "../services/category/categoryService"
import { ICategoryControllers } from "../controllers/interfaces/ICategoryContollers"
import { CategoryContoller } from "../controllers/category/categoryControllers"
import IAdminRepository from "../repositories/interfaces/IAdminRepository"
import IAdminService from "../services/interfaces/IAdminService"
import { IAdminControllers } from "../controllers/interfaces/IAdminControllers"
import { AdminRepository } from "../repositories/admin/adminRepository"
import { AdminService } from "../services/admin/adminService"
import { AdminController } from "../controllers/admin/adminController"



const categoryRepository:ICategoryRepository=new CategoryRepository()
const categoryService:ICategoryService=new CategoryService(categoryRepository)
const categoryController:ICategoryControllers=new CategoryContoller(categoryService)

const adminRepository:IAdminRepository=new AdminRepository()
const adminService:IAdminService=new AdminService(adminRepository)
const adminController:IAdminControllers=new AdminController(adminService)

export { categoryController,adminController}