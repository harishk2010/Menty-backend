import { StudentController } from "../controllers/studentController";
import { Router } from "express";
import upload from "../utils/multer";
import { isAdmin, isStudent } from "../middlewares/roleAuth";
const router=Router()
let studentController=new StudentController()

router.patch('/updateProfile',upload.single('profile'),isStudent,studentController.updateProfile.bind(studentController))
router.patch('/updatePassword',isStudent,studentController.updatePassword.bind(studentController))

//block/unblock
router.get('/getStudents',studentController.getStudents.bind(studentController))
router.patch('/blockStudent/:email',studentController.blockStudent.bind(studentController))
router.get('/:email',studentController.getStudent.bind(studentController))
// router.get('/getStudents',(req:Request,res:Response)=>{
//     res.json("hii")
// })

const studentRoutes=router
export default studentRoutes