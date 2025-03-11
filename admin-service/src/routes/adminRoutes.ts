import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { adminController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import { isAdmin } from "../middlewares/roleAuth";

const router = Router();

router
  .route("/adminDetails/:email")
  .get(authenticateToken,isAdmin, adminController.getAdminDetails.bind(adminController));

const adminRoutes = router;
export default adminRoutes;
