import { instructorController } from "../config/dependencyInjector";
import { Router } from "express";
import upload from "../utils/multer";
import { isAdmin, isInstructor } from "../middlewares/roleAuth";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
const router=Router()


router.post('/updateProfile',authenticateToken,upload.single('profile'),isInstructor,instructorController.updateProfile.bind(instructorController))
router.patch('/updatePassword',isInstructor,instructorController.updatePassword.bind(instructorController))

//block/unblock
router.get('/getInstructors',authenticateToken,instructorController.getInstructors.bind(instructorController))
router.get('/transactions',authenticateToken,instructorController.getTransactions.bind(instructorController))
router.patch('/blockInstructor/:email',instructorController.blockInstructor.bind(instructorController))
router.get('/instructor/:instructorId',authenticateToken,instructorController.getInstructorById.bind(instructorController))
router.get('/:email',authenticateToken,instructorController.getInstructor.bind(instructorController))


const instructorRoutes=router
export default instructorRoutes