import { studentController } from "../config/dependencyInjector";
import { Router } from "express";
import upload from "../utils/multer";
import { isAdmin, isStudent } from "../middlewares/roleAuth";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
const router = Router();

router.patch(
  "/updateProfile",
  authenticateToken,
  upload.single("profile"),
  isStudent,
  studentController.updateProfile.bind(studentController)
);
router.patch(
  "/updatePassword",
  authenticateToken,
  isStudent,
  studentController.updatePassword.bind(studentController)
);

//block/unblock
router.get(
  "/getStudents",
  authenticateToken,
  studentController.getStudents.bind(studentController)
);
router.get(
  "/student/:studentId",
  authenticateToken,
  studentController.getStudentDataById.bind(studentController)
);
router.patch(
  "/blockStudent/:email",
  studentController.blockStudent.bind(studentController)
);
router.get(
  "/:email",
  authenticateToken,
  studentController.getStudent.bind(studentController)
);
router.get(
  "/search",
  authenticateToken,
  studentController.searchStudents.bind(studentController)
);

const studentRoutes = router;
export default studentRoutes;
