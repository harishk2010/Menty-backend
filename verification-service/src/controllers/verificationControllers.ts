import { Request, Response } from "express";
import { IVerificationControllers } from "./IVerificationControllers";

import { uploadToS3Bucket } from "../utils/s3Bucket";
import { IVerificationService } from "../services/IVerificationService";
// import { VerificationService } from "@/services/verificationService";
export class VerificationContoller implements IVerificationControllers {
  private verificationService: IVerificationService;
  constructor(verificationService: IVerificationService) {
    this.verificationService = verificationService;
  }

  async submitRequest(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;
      if (!req.files || typeof req.files !== "object") {
        throw new Error("No documents received");
      }

      // Cast `req.files` to the expected shape
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[]; // Type assertion
      };

      // Safely access the files
      const degreeCertificate = files.degreeCertificate?.[0] || null;
      const resume = files.resume?.[0] || null;
      //   console.log(degreeCertificate,resume)
      let degreeCertificateUrl;
      let resumeUrl;
      if (degreeCertificate && resume) {
        degreeCertificateUrl = await uploadToS3Bucket(
          degreeCertificate,
          "degreeCertificate"
        );
        resumeUrl = await uploadToS3Bucket(resume, "resume");

        let response = await this.verificationService.sendVerifyRequest(
          username,
          email,
          degreeCertificateUrl,
          resumeUrl
        );
        res.status(200).send({
          success: true,
          message: "Verification Request Sent",
          data: response,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No Documents",
        });
      }
    } catch (error) {
      throw new Error("Verify Request Document failed Creation at controller");
    }
  }
}
