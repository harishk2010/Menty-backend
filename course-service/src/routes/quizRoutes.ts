import { quizController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { Router } from "express";

const router = Router();

router
  .route("/addQuiz")
  .post(authenticateToken, quizController.addQuiz.bind(quizController));
router
  .route("/editQuiz/:quizId")
  .put(authenticateToken, quizController.editQuiz.bind(quizController));
router
  .route("/getQuiz/:quizId")
  .get(authenticateToken, quizController.getQuiz.bind(quizController));
router
  .route("/sumbitResult/:courseId")
  .put(authenticateToken, quizController.submitResult.bind(quizController));

const quizRoutes = router;
export default quizRoutes;
