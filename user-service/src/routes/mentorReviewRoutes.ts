import { mentorReviewController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { Router } from "express";

const router = Router();

router
  .route("/addReview")
  .post(
    authenticateToken,
    mentorReviewController.createReview.bind(mentorReviewController)
  );

router
  .route("/:mentorId")
  .get(
    authenticateToken,
    mentorReviewController.getMentorReviews.bind(mentorReviewController)
  );

const mentorReviewRoutes = router;
export default mentorReviewRoutes;
