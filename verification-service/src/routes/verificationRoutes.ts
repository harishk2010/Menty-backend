import upload from "../utils/multer";
import { verificationController } from "../config/dependencyInjector";
import express, { Request, Response, Router } from "express";

const router = Router();

router.post(
  "/verificationRequest",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  verificationController.submitRequest.bind(verificationController)
);

const verificationRoutes = router;
export default verificationRoutes;
