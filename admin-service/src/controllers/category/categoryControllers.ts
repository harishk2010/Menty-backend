import { NextFunction, Request, Response } from "express";
import { ICategoryControllers } from "../interfaces/ICategoryContollers";
import { ICategoryService } from "../../services/interfaces/ICategoryService";
import { CategoryErrorMsg, CategorySuccessMsg, GeneralServerErrorMsg } from "@/utils/constants";
import { StatusCode } from "@/utils/enums";

export class CategoryContoller implements ICategoryControllers {
  private categoryService: ICategoryService;
  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  async addCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryName } = req.body;
      const existingCategory = await this.categoryService.findCategoryByName(
        categoryName
      );
      if (existingCategory) {
        res
          .status(StatusCode.CONFLICT)
          .send({ success: false, message: CategoryErrorMsg.CATEGORY_EXISTS });
        return;
      }

      const createdCategory = await this.categoryService.addCategory(
        categoryName
      );
      if (createdCategory) {
        res
          .status(StatusCode.CREATED)
          .send({
            success: true,
            message: CategorySuccessMsg.CATEGORY_ADDED,
            data: createdCategory,
          });
      } else {
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: CategoryErrorMsg.CATEGORY_NOT_CREATED });
      }
    } catch (error) {
      next(error);
    }
  }

  async editCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryName, id } = req.body;
      const existingCategory = await this.categoryService.findCategoryByName(
        categoryName
      );
      if (existingCategory) {
        res
          .status(StatusCode.CONFLICT)
          .send({ success: false, message: CategoryErrorMsg.CATEGORY_EXISTS });
        return;
      }

      const updatedCategory = await this.categoryService.updateCategory(
        id,
        categoryName
      );
      if (updatedCategory) {
        res
          .status(StatusCode.OK)
          .send({
            success: true,
            message: CategorySuccessMsg.CATEGORY_UPDATED,
            data: updatedCategory,
          });
      } else {
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: CategoryErrorMsg.CATEGORY_NOT_UPDATED });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategory();
      res
        .status(StatusCode.OK)
        .send({
          success: true,
          message: CategorySuccessMsg.CATEGORY_FETCHED,
          data: categories,
        });
    } catch (error) {
      next(error);
    }
  }

  async listOrUnlistCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const response = await this.categoryService.listOrUnlistCategory(id);

      if (!response) throw new Error(GeneralServerErrorMsg.INTERNAL_SERVER_ERROR);

      const message = response.isListed
        ? CategorySuccessMsg.CATEGORY_LISTED
        : CategorySuccessMsg.CATEGORY_UNLISTED;
      res.status(StatusCode.OK).send({ success: true, message, data: response });
    } catch (error) {
      next(error);
    }
  }

  async findCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = req.params;
      const response = await this.categoryService.findCategoryById(categoryId);

      if (!response) throw new Error(GeneralServerErrorMsg.INTERNAL_SERVER_ERROR);

      res.status(StatusCode.OK).send({ success: true, message:CategorySuccessMsg.CATEGORY_FETCHED, data: response });
    } catch (error) {
      next(error);
    }
  }
}
