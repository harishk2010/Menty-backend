import { ICategoryRepository } from '../../repositories/category/ICategoryRepository'
import {ICategoryService} from '../category/ICategoryService'

export class CategoryService implements ICategoryService{
    
    private categoryRepository:ICategoryRepository
    constructor(categoryRepository:ICategoryRepository){
        this.categoryRepository=categoryRepository
    }

}