import { StudentController } from "../controllers/studentController";
import { Router } from "express";
import upload from "../utils/multer";
const router=Router()
let studentController=new StudentController()

router.get('/:email',studentController.getStudent.bind(studentController))
router.patch('/updateProfile',upload.single('profile'),studentController.updateProfile.bind(studentController))


const studentRoutes=router
export default studentRoutes