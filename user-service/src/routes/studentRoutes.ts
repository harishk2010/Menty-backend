import { StudentController } from "../controllers/studentController";
import { Router } from "express";
import upload from "../utils/multer";
const router=Router()
let studentController=new StudentController()

router.get('/:email',studentController.getStudent.bind(studentController))
router.patch('/updateProfile',upload.single('profile'),studentController.updateProfile.bind(studentController))
router.patch('/updatePassword',studentController.updatePassword.bind(studentController))

//block/unblock
router.get('/getStudents',studentController.getStudents.bind(studentController))
// router.get('/getStudents',(req:Request,res:Response)=>{
//     res.json("hii")
// })

const studentRoutes=router
export default studentRoutes