
import { ICategoryModel } from "../../models/categoryModel";
import { ICategoryBaseRepository } from "../baseRepository/category/ICategoryBaseRepository";
import { CategoryBaseRepository } from "../baseRepository/category/categoryBaseRepository";
import { ICategoryRepository } from "./ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
    private categoryBaseRepository:ICategoryBaseRepository
    constructor(categoryBaseRepository:ICategoryBaseRepository){
        this.categoryBaseRepository=categoryBaseRepository
    }
    async  findCategoryByName(categoryName:string):Promise<ICategoryModel | null>{
        try {
            let response =await this.categoryBaseRepository.findCategoryByName(categoryName)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async  findCategoryById(categoryId:string):Promise<ICategoryModel | null>{
        try {
            
            let response =await this.categoryBaseRepository.findCategoryById(categoryId)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async  addCategory(categoryName:string):Promise<ICategoryModel | null>{
        try {
            let response =await this.categoryBaseRepository.addCategory(categoryName)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async  updateCategory(id:string,categoryName:string):Promise<ICategoryModel | null>{
        try {
            let response =await this.categoryBaseRepository.updateCategory(id,categoryName)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async  getAllCategory():Promise<ICategoryModel[]>{
        try {
            let response =await this.categoryBaseRepository.getAllCategory()
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async  listOrUnlistCategory(id:string):Promise<ICategoryModel | null>{
        try {
            let response =await this.categoryBaseRepository.listOrUnlistCategory(id)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    

}