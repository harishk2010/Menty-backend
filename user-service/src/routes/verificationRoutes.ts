import upload from "../utils/multer";
import { verificationController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";
import {
  isAdmin,
  isAdminOrInstructor,
  isInstructor,
} from "../middlewares/roleAuth";

const router = Router();

router.post(
  "/verificationRequest",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  isInstructor,
  verificationController.submitRequest.bind(verificationController)
);
router.post(
  "/reVerifyRequest",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  isInstructor,
  verificationController.reVerifyRequest.bind(verificationController)
);

router.get(
  "/request/:email",
  isAdminOrInstructor,
  verificationController.getRequestData.bind(verificationController)
);
router.get(
  "/requests",
  isAdminOrInstructor,
  verificationController.getAllRequests.bind(verificationController)
);
router.post(
  "/approveRequest",
  isAdmin,
  verificationController.approveRequest.bind(verificationController)
);

const verificationRoutes = router;
export default verificationRoutes;
