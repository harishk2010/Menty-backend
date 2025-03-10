import { adminController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";

const router = Router();

router
  .route("/adminDetails/:email")
  .get(adminController.getAdminDetails.bind(adminController));

const adminRoutes = router;
export default adminRoutes;
