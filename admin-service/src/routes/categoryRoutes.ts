import upload from "../utils/multer";
import { categoryController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import authenticateToken from "../middlewares/AuthenticatedRoutes";

const router = Router();

router
  .route("/category")
  .post(authenticateToken,categoryController.addCategory.bind(categoryController))
  .put(authenticateToken,categoryController.editCategory.bind(categoryController));

router
  .route("/categories")
  .get(authenticateToken,categoryController.getAllCategory.bind(categoryController));
router
  .route("/listOrUnlist/:id")
  .put(authenticateToken, categoryController.listOrUnlistCategory.bind(categoryController));
router
  .route("/:categoryId")
  .put(authenticateToken,categoryController.findCategoryById.bind(categoryController));

const categoryRoutes = router;
export default categoryRoutes;
