import { updateRequestType } from "@/Types/updateRequestType";
import { ICategoryBaseRepository } from "./ICategoryBaseRepository";
import { CategoryModel, ICategoryModel } from "../../../models/categoryModel";

export class CategoryBaseRepository implements ICategoryBaseRepository {
  async findCategoryByName(
    categoryName: string
  ): Promise<ICategoryModel | null> {
    try {
      const response = await CategoryModel.findOne({
        categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findCategoryById(
    categoryId: string
  ): Promise<ICategoryModel | null> {
    try {
        console.log(categoryId,"iddd")
        const response = await CategoryModel.findById(categoryId);
        console.log(response,"ressddd")
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addCategory(categoryName: string): Promise<ICategoryModel | null> {
    try {
      const response = await CategoryModel.create({ categoryName });
      await response.save();

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateCategory(id:string,categoryName: string): Promise<ICategoryModel | null> {
    try {
      const response = await CategoryModel.findByIdAndUpdate(
        { _id:id },
        {
          $set: {
            categoryName,
          },
        },
        {
          new: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async listOrUnlistCategory(id: string): Promise<ICategoryModel | null> {
    try {
      const category = await CategoryModel.findById(id);
      
      if(!category){
        throw new Error("No category found")
      }
      const isListed = category?.isListed;

      const response = await CategoryModel.findOneAndUpdate(
        { _id:id },
        {
          $set: {
            isListed: !isListed,
          },
        },
        {
          new: true,
        }
      );
      console.log(response,"responseeee")
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllCategory(): Promise<ICategoryModel[]> {
    try {
      const response = await CategoryModel.find();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
