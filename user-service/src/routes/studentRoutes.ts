import { StudentController } from "../controllers/studentController";
import { Router } from "express";

const router=Router()
let studentController=new StudentController()

// router.get('/',studentController.setUser.bind(studentController))


const studentRoutes=router
export default studentRoutes