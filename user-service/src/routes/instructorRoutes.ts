import { InstructorController } from "../controllers/instructorController";
import { Router } from "express";
import upload from "../utils/multer";
const router=Router()
let instructorController=new InstructorController()

router.patch('/updateProfile',upload.single('profile'),instructorController.updateProfile.bind(instructorController))
router.patch('/updatePassword',instructorController.updatePassword.bind(instructorController))

//block/unblock
router.get('/getInstructors',instructorController.getInstructors.bind(instructorController))
router.get('/blockInstructor/:email',instructorController.blockInstructor.bind(instructorController))
router.get('/:email',instructorController.getInstructor.bind(instructorController))


const instructorRoutes=router
export default instructorRoutes