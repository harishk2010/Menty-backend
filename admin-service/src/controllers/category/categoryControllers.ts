import { NextFunction, Request, Response } from "express";
import { ICategoryControllers } from "./ICategoryContollers";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import { ICategoryService } from "../../services/category/ICategoryService";
import produce from "../../config/kafka/producer";
import { ICategoryModel } from "../../models/categoryModel";

export class CategoryContoller implements ICategoryControllers {
  private categoryService: ICategoryService;

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  async addCategory(req: Request, res: Response ,next:NextFunction): Promise<void> {
    try {
      
      // console.log("inside add category controller")
      const { categoryName } = req.body;
      console.log("inside add category controller",categoryName)

      //find category name
      const existingCategory = await this.categoryService.findCategoryByName(
        categoryName
      );
      if (existingCategory) {
        res.status(409).send({
          success: false,
          message: "Category already exits",
        });
        return;
      }
      console.log("existiing",existingCategory)
      const createdCategory = await this.categoryService.addCategory(
        categoryName
      );
      console.log("createdCategory",createdCategory)
      if (createdCategory) {
        res.status(201).send({
          success: true,
          message: "Category added Successfully!",
          data: createdCategory,
        });
      } else {
        res.status(500).send({
          success: false,
          message: "Could not create Category!",
          
        });
      }
    } catch (error) {
      // console.log(error);
      // throw error;
      next(error)
    }
  }

  async editCategory(req:Request ,res:Response, next:NextFunction):Promise<void>{
    try {

      const { categoryName , id}=req.body
      const existingCategory = await this.categoryService.findCategoryByName(
        categoryName
      );
      if (existingCategory) {
        res.send({
          success: false,
          message: "Category already exits",
        });
        return;
      }
      console.log("existiing",existingCategory)
      const updatedCategory=await this.categoryService.updateCategory(id,categoryName)
      if(updatedCategory){
        res.status(200).send({
          success:true,
          message:"Category Updated",
          data:updatedCategory
        })
      }else{
        res.status(500).send({
          success:false,
          message:"Category Not Updated",
          data:updatedCategory
        })
      }
      
    } catch (error) {
      console.log(error)
      next(error)
    }

  }
  async getAllCategory(req:Request ,res:Response, next:NextFunction):Promise<void>{
    try {

      const Categories=await this.categoryService.getAllCategory()

      res.status(200).send({
        success:true,
        message:"Fetched Categories",
        data:Categories
      })
    
      
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  async listOrUnlistCategory(req:Request ,res:Response, next:NextFunction):Promise<void>{
    try {

      const { id }=req.params

      const response=await this.categoryService.listOrUnlistCategory(id)

      if(!response){
       throw new Error("Internal server error")
      }
      if(response?.isListed){
        res.status(200).send({
          success:true,
          message:`Listed ${response.categoryName}`,
          data:response
        })

      }else{
        res.status(200).send({
          success:true,
          message:`UnListed ${response?.categoryName}`,
          data:response
        })
      }
      
    
      
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  async findCategoryById(req:Request ,res:Response, next:NextFunction):Promise<void>{
    try {

      const { categoryId }=req.params
  

      const response=await this.categoryService.findCategoryById(categoryId)

      if(!response){
       throw new Error("Internal server error")
      }
      if(response?.isListed){
        res.status(200).send({
          success:true,
          message:`Listed ${response.categoryName}`,
          data:response
        })

      }else{
        res.status(200).send({
          success:true,
          message:`UnListed ${response?.categoryName}`,
          data:response
        })
      }
      
    
      
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  
}
