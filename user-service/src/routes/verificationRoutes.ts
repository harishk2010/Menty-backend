import upload from "../utils/multer";
import { verificationController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import {
  isAdmin,
  isAdminOrInstructor,
  isInstructor,
} from "../middlewares/roleAuth";
import authenticateToken from "../middlewares/AuthenticatedRoutes";

const router = Router();

router.post(
  "/verificationRequest",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  authenticateToken,
  isInstructor,
  verificationController.submitRequest.bind(verificationController)
);
router.post(
  "/reVerifyRequest",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  authenticateToken,
  isInstructor,
  verificationController.reVerifyRequest.bind(verificationController)
);

router.get(
  "/request/:email",
  authenticateToken,
  isAdminOrInstructor,
  verificationController.getRequestData.bind(verificationController)
);
router.get(
  "/requests",
  authenticateToken,
  isAdminOrInstructor,
  verificationController.getAllRequests.bind(verificationController)
);
router.post(
  "/approveRequest",
  authenticateToken,
  isAdmin,
  verificationController.approveRequest.bind(verificationController)
);

const verificationRoutes = router;
export default verificationRoutes;
