import { Request, Response } from "express";
import { IVerificationControllers } from "../../interfaces/IVerificationControllers";
import { uploadToS3Bucket } from "../../../utils/s3Bucket";
import { IVerificationService } from "../../../services/interfaces/IVerificationService";
import produce from "../../../config/kafka/producer";
import { instructorController } from "../../../config/dependencyInjector";

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
        const emailID = response.email;
        const status = response.status;

        await instructorController.updateVerifyStatus({ emailID, status });

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
  async reVerifyRequest(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, degreeCertificate, resume } = req.body;

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      let degreeCertificateUrl = degreeCertificate || ""; // Ensure it's not undefined
      let resumeUrl = resume || "";

      const uploadPromises = [];

      if (files) {
        const degreeCertificateFile = files.degreeCertificate?.[0];
        const resumeFile = files.resume?.[0];

        if (degreeCertificateFile) {
          uploadPromises.push(
            uploadToS3Bucket(degreeCertificateFile, "degreeCertificate").then(
              (url) => (degreeCertificateUrl = url)
            )
          );
        }

        if (resumeFile) {
          uploadPromises.push(
            uploadToS3Bucket(resumeFile, "resume").then(
              (url) => (resumeUrl = url)
            )
          );
        }
      }

      await Promise.all(uploadPromises);

      const status = "pending";

      const response = await this.verificationService.updateRequest(email, {
        username,
        degreeCertificateUrl,
        resumeUrl,
        status,
      });

      if (response) {
        const emailID = response.email;
        await instructorController.updateVerifyStatus({ emailID, status });

        res.status(200).send({
          success: true,
          message: "Re-Verify Request Sent!",
          data: response,
        });
      } else {
        res.status(500).send({
          success: false,
          message: "Failed to process verification request",
        });
      }
    } catch (error: any) {
      console.error("Error in reVerifyRequest:", error);
      res.status(500).send({
        success: false,
        message: "Verify Request Document failed Creation at controller",
        error: error.message,
      });
    }
  }

  async getRequestData(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const requestData = await this.verificationService.getRequestData(email);
      if (requestData) {
        res.status(200).json({
          data: requestData,
        });
      } else {
        res.json(requestData);
      }
    } catch (error) {
      throw new Error("Error ");
    }
  }
  async getAllRequests(req: Request, res: Response): Promise<void> {
    try {
      const requestData = await this.verificationService.getAllRequests();
      if (requestData) {
        res.status(200).json(requestData);
      } else {
        res.json(requestData);
      }
    } catch (error) {
      throw new Error("Error ");
    }
  }

  async approveRequest(req: Request, res: Response): Promise<void> {
    try {
      const { email, status } = req.body;

      const approvedRequest = await this.verificationService.approveRequest(
        email,
        status
      );
      if (approvedRequest) {
        await instructorController.approveRequest({
          emailID: email,
          status: approvedRequest.status,
        });
        if (approvedRequest.status == "approved") {
          let email = approvedRequest.email;
          let username = approvedRequest.username;

          produce("verified-Instructor-email", { email, username });

          res.status(200).json({
            success: true,
            message: "Verified Instructor",
            data: approvedRequest,
          });
        } else if (approvedRequest.status === "rejected") {
          res.status(200).json({
            success: true,
            message: "Rejected Instructor",
            data: approvedRequest,
          });
        }
      } else {
        res.json(approvedRequest);
      }
    } catch (error) {
      throw new Error("Error in controller ");
    }
  }
}
