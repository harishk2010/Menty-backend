import { Request, Response } from "express";
import { ICategoryControllers } from "./ICategoryContollers";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import { ICategoryService } from "../../services/category/ICategoryService";
import produce from "../../config/kafka/producer";

export class CategoryContoller implements ICategoryControllers {
  private categoryService: ICategoryService;

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  async addCategory(req:Request,res:Response):Promise<void>{
    try {
        const { categoryName }=req.body
        if(!categoryName){
            res.send(404).send({
                success:false,
                message:"categoryname missing"
            })
            return
        }
        //find category name
        const existingCategory= await this.categoryService.find

        
    } catch (error) {
        console.log(error)
        throw error
    }
  }

  
}
