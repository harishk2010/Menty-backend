import { instructorController } from "../config/dependencyInjector";
import { Router } from "express";
import upload from "../utils/multer";
import { isAdmin, isInstructor } from "../middlewares/roleAuth";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
const router = Router();

router.post(
  "/updateProfile",
  authenticateToken,
  upload.single("profile"),
  isInstructor,
  instructorController.updateProfile.bind(instructorController)
);
router.patch(
  "/updatePassword",
  authenticateToken,
  isInstructor,
  instructorController.updatePassword.bind(instructorController)
);

//block/unblock
router.get(
  "/getInstructors",
  authenticateToken,
  instructorController.getInstructors.bind(instructorController)
);
router.get(
  "/transactions",
  authenticateToken,
  instructorController.getTransactions.bind(instructorController)
);
router.post(
  "/blockInstructor/:email",
  authenticateToken,
  instructorController.blockInstructor.bind(instructorController)
);
router.put(
  "/updatePlanPrice/:instructorId",
  authenticateToken,
  instructorController.updatePlanPrice.bind(instructorController)
);
router.get(
  "/instructor/:instructorId",
  authenticateToken,
  instructorController.getInstructorById.bind(instructorController)
);
router.get(
  "/:email",
  authenticateToken,
  instructorController.getInstructor.bind(instructorController)
);
router.get(
  "/get/paginatedMentors",
  authenticateToken,
  instructorController.getPaginatedMentors.bind(instructorController)
);
router.get(
  "/get/expertise",
  authenticateToken,
  instructorController.getMentorExpertise.bind(instructorController)
);

const instructorRoutes = router;
export default instructorRoutes;
