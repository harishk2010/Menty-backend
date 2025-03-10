import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { adminController } from "../config/dependencyInjector";
import { Router } from "express";

let router = Router();

router.post("/login", adminController.login.bind(adminController));
router.post("/logout", adminController.logout.bind(adminController));

const adminRoutes = router;
export default adminRoutes;
