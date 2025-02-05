import { ICategoryModel } from '@/models/categoryModel'
import { updateRequestType } from '../../Types/updateRequestType'


export interface ICategoryService{
    findCategoryByName(categoryName:string):Promise<ICategoryModel | null>
    addCategory(categoryName:string):Promise<ICategoryModel | null>
    updateCategory(id:string,categoryName:string):Promise<ICategoryModel | null>
    listOrUnlistCategory(id:string):Promise<ICategoryModel | null>
    findCategoryById(categoryId:string):Promise<ICategoryModel | null>
    getAllCategory():Promise<ICategoryModel[]>
    
}