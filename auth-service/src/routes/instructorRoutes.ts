import  authenticateToken  from "../middlewares/AuthenticatedRoutes";
import { instructorController } from "../config/dependencyInjector";
import { Router } from "express";
import { isInstructor } from "../middlewares/roleAuth";

let router=Router()


router.post('/register',instructorController.instructorSignUp.bind(instructorController))
router.post('/resendOtp',instructorController.resendOtp.bind(instructorController))
router.post('/createUser',instructorController.createUser.bind(instructorController))
router.post('/login',instructorController.login.bind(instructorController))
router.post('/logout',instructorController.logout.bind(instructorController))
router.post('/verifyEmail',instructorController.verifyEmail.bind(instructorController))
router.post('/verifyResetOtp',instructorController.verifyResetOtp.bind(instructorController))
router.post('/forgotResendOtp',instructorController.forgotResendOtp.bind(instructorController))
router.post('/resetPassword',instructorController.resetPassword.bind(instructorController))
router.post('/googleLogin',instructorController.doGoogleLogin.bind(instructorController))
//test route
router.get('/test',authenticateToken,instructorController.test.bind(instructorController))



const instructorRoutes = router
export default instructorRoutes;
