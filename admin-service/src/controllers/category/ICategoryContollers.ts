import { NextFunction, Request, Response } from "express";

export interface ICategoryControllers {
  addCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  editCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  listOrUnlistCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  findCategoryById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}