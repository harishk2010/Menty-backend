import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { AdminController } from "../controllers/adminController";
import { Router } from "express";

let router=Router()
let adminController=new AdminController()

router.post('/login',adminController.login.bind(adminController))
router.post('/logout',adminController.logout.bind(adminController))

const adminRoutes = router
export default adminRoutes;
