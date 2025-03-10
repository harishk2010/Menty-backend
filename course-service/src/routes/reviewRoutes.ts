import { reviewController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { Router } from "express";

const router = Router();

router
  .route("/addReview")
  .post(
    authenticateToken,
    reviewController.createReview.bind(reviewController)
  );
router
  .route("/:courseId")
  .get(
    authenticateToken,
    reviewController.getCourseReviews.bind(reviewController)
  );

const reviewRoutes = router;
export default reviewRoutes;
