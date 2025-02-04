import { IMentorshipService } from "../services/mentorship/IMentorshipService"
import { IMentorshipControllers } from "../controllers/mentorship/IMentorshipControllers"
import { MentorshipContoller } from "../controllers/mentorship/mentorshipControllers"
import { MentorshipService } from "../services/mentorship/mentorshipService"
import { IMentorshipRepository } from ".././repositories/IMentorshipRepository"
import { MentorshipRepository } from ".././repositories/mentorshipRepository"
import { IMentorshipBaseRepository } from ".././repositories/baseRepository/IMentorshipBaseRepository"
import { MentorshipBaseRepository } from ".././repositories/baseRepository/mentorshipBaseRepository"
import { ICategoryRepository } from "../repositories/category/ICategoryRepository"
import { CategoryRepository } from "../repositories/category/categoryRepository"
import { ICategoryBaseRepository } from "../repositories/baseRepository/category/ICategoryBaseRepository"
import { CategoryBaseRepository } from "../repositories/baseRepository/category/categoryBaseRepository"
import { ICategoryService } from "../services/category/ICategoryService"
import { CategoryService } from "../services/category/categoryService"
import { ICategoryControllers } from "../controllers/category/ICategoryContollers"
import { CategoryContoller } from "../controllers/category/categoryControllers"


const mentorshipBaseRepository:IMentorshipBaseRepository=new MentorshipBaseRepository()
const mentorshipRepository:IMentorshipRepository=new MentorshipRepository(mentorshipBaseRepository)
const mentorshipService:IMentorshipService=new MentorshipService(mentorshipRepository)
const  mentorshipController:IMentorshipControllers=new MentorshipContoller(mentorshipService)


const categoryBaseRepository:ICategoryBaseRepository=new CategoryBaseRepository()
const categoryRepository:ICategoryRepository=new CategoryRepository(categoryBaseRepository)
const categoryService:ICategoryService=new CategoryService(categoryRepository)
const categoryController:ICategoryControllers=new CategoryContoller(categoryService)

export { mentorshipController,categoryController}