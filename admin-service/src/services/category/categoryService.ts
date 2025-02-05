import { response } from 'express'
import { ICategoryModel } from '../../models/categoryModel'
import { ICategoryRepository } from '../../repositories/category/ICategoryRepository'
import {ICategoryService} from '../category/ICategoryService'

export class CategoryService implements ICategoryService{
    
    private categoryRepository:ICategoryRepository
    constructor(categoryRepository:ICategoryRepository){
        this.categoryRepository=categoryRepository
    }

    async findCategoryByName(categoryName:string):Promise<ICategoryModel | null>{
        try {
            const response=this.categoryRepository.findCategoryByName(categoryName)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async findCategoryById(categoryId:string):Promise<ICategoryModel | null>{
        try {
            const response=this.categoryRepository.findCategoryById(categoryId)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async addCategory(categoryName:string):Promise<ICategoryModel | null>{
        try {
            const response=this.categoryRepository.addCategory(categoryName)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async updateCategory(id:string,categoryName:string):Promise<ICategoryModel | null>{
        try {
            const response=this.categoryRepository.updateCategory(id,categoryName)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async getAllCategory():Promise<ICategoryModel[] >{
        try {
            const response=this.categoryRepository.getAllCategory()
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async listOrUnlistCategory(id:string):Promise<ICategoryModel | null >{
        try {
            const response=this.categoryRepository.listOrUnlistCategory(id)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}