import { NextFunction, Request, Response } from "express";
import { ICategoryControllers } from "../../interfaces/ICategoryContollers";
import { ICategoryService } from "../../interfaces/ICategoryService";

export class CategoryContoller implements ICategoryControllers {
  private categoryService: ICategoryService
  constructor( categoryService: ICategoryService) {
    this.categoryService=categoryService
  }

  async addCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryName } = req.body;
      const existingCategory = await this.categoryService.findCategoryByName(categoryName);
      if (existingCategory) {
        res.status(409).send({ success: false, message: "Category already exists" });
        return;
      }

      const createdCategory = await this.categoryService.addCategory(categoryName);
      if (createdCategory) {
        res.status(201).send({ success: true, message: "Category added successfully!", data: createdCategory });
      } else {
        res.status(500).send({ success: false, message: "Could not create category!" });
      }
    } catch (error) {
      next(error);
    }
  }

  async editCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryName, id } = req.body;
      const existingCategory = await this.categoryService.findCategoryByName(categoryName);
      if (existingCategory) {
        res.status(409).send({ success: false, message: "Category already exists" });
        return;
      }

      const updatedCategory = await this.categoryService.updateCategory(id, categoryName);
      if (updatedCategory) {
        res.status(200).send({ success: true, message: "Category updated", data: updatedCategory });
      } else {
        res.status(500).send({ success: false, message: "Category not updated" });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategory();
      res.status(200).send({ success: true, message: "Fetched categories", data: categories });
    } catch (error) {
      next(error);
    }
  }

  async listOrUnlistCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const response = await this.categoryService.listOrUnlistCategory(id);

      if (!response) throw new Error("Internal server error");

      const message = response.isListed ? `Listed ${response.categoryName}` : `Unlisted ${response.categoryName}`;
      res.status(200).send({ success: true, message, data: response });
    } catch (error) {
      next(error);
    }
  }

  async findCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId } = req.params;
      const response = await this.categoryService.findCategoryById(categoryId);

      if (!response) throw new Error("Internal server error");

      const message = response.isListed ? `Listed ${response.categoryName}` : `Unlisted ${response.categoryName}`;
      res.status(200).send({ success: true, message, data: response });
    } catch (error) {
      next(error);
    }
  }
}