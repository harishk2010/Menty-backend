import { Router } from "express";
import { adminDashboardController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/AuthenticatedRoutes";

const router = Router();

router
  .route("/dashboard")
  .get(
    authenticateToken,
    adminDashboardController.getDashboardData.bind(adminDashboardController)
  );

const adminDashboardRoutes = router;
export default adminDashboardRoutes;
