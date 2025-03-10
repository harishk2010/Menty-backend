import upload from "../utils/multer";
import { categoryController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";

const router = Router();

router
  .route("/category")
  .post(categoryController.addCategory.bind(categoryController))
  .put(categoryController.editCategory.bind(categoryController));

router
  .route("/categories")
  .get(categoryController.getAllCategory.bind(categoryController));
router
  .route("/listOrUnlist/:id")
  .put(categoryController.listOrUnlistCategory.bind(categoryController));
router
  .route("/:categoryId")
  .put(categoryController.findCategoryById.bind(categoryController));

const categoryRoutes = router;
export default categoryRoutes;
