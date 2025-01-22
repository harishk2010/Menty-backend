import { StudentController } from "../controllers/studentController";
import { Router } from "express";

const router=Router()
let studentController=new StudentController()

router.get('/:email',studentController.getStudent.bind(studentController))
router.patch('/updateProfile',studentController.updateProfile.bind(studentController))


const studentRoutes=router
export default studentRoutes