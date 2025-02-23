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
  
router
  .route("/instructorBookings/:instructorId")
  .get(authenticateToken,bookingController.getBookingsByInstructorId.bind(bookingController));

router
  .route("/bookingData/:bookingId")
  .get(authenticateToken,bookingController.getBookindDataById.bind(bookingController));

  const bookingRoutes= router
  export default bookingRoutes