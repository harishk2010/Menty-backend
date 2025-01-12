import { InstructorController } from "../controllers/instructorController";
import { Router } from "express";

let router=Router()
let instructorController=new InstructorController()

router.post('/register',instructorController.instructorSignUp.bind(instructorController))


const instructorRoutes = router
export default instructorRoutes;
