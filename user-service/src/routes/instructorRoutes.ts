import { InstructorController } from "../controllers/instructorController";
import { Router } from "express";
import upload from "../utils/multer";
import { isAdmin, isInstructor } from "../middlewares/roleAuth";
const router=Router()
let instructorController=new InstructorController()

router.post('/updateProfile',upload.single('profile'),isInstructor,instructorController.updateProfile.bind(instructorController))
router.patch('/updatePassword',isInstructor,instructorController.updatePassword.bind(instructorController))

//block/unblock
router.get('/getInstructors',instructorController.getInstructors.bind(instructorController))
router.patch('/blockInstructor/:email',instructorController.blockInstructor.bind(instructorController))
router.get('/:email',instructorController.getInstructor.bind(instructorController))


const instructorRoutes=router
export default instructorRoutes