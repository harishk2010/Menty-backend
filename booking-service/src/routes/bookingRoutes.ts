import { bookingController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/AuthenticatedRoutes";
import { Router } from "express";

const router=Router()

router
  .route("/addBooking")
  .post(authenticateToken,bookingController.bookSlot.bind(bookingController));
router
  .route("/:studentId")
  .get(authenticateToken,bookingController.getBookingsByStudentId.bind(bookingController));

  const bookingRoutes= router
  export default bookingRoutes