import { Request, Response } from "express";
import { IVerificationControllers } from "../../../interfaces/IVerificationControllers";
import { uploadToS3Bucket } from "../../../utils/s3Bucket";
import { IVerificationService } from "../../../interfaces/IVerificationService";
import produce from "../../../config/kafka/producer";
import { instructorController } from "../../../config/dependencyInjector";
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
        const emailID = response.email;
        const status = response.status;

        // produce("verification-request", { emailID, status });
        await instructorController.updateVerifyStatus({emailID ,status})

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
      console.log(error);
      throw new Error("Verify Request Document failed Creation at controller");
    }
  }
  async reVerifyRequest(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, degreeCertificate, resume } = req.body;
      console.log(
        { username, email, degreeCertificate, resume },
        "=>form Body"
      );

      // Type assertion for `req.files`
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      console.log(files, "==> Files received from request");

      // Use existing URLs if no new files are uploaded
      let degreeCertificateUrl = degreeCertificate || ""; // Ensure it's not undefined
      let resumeUrl = resume || "";

      const uploadPromises = [];

      if (files) {
        const degreeCertificateFile = files.degreeCertificate?.[0];
        const resumeFile = files.resume?.[0];

        console.log(
          { degreeCertificateFile, resumeFile },
          "==> Extracted Files"
        );

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

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);

      const status = "pending";

      // Call the verification service with updated URLs
      const response = await this.verificationService.updateRequest(email, {
        username,
        degreeCertificateUrl,
        resumeUrl,
        status,
      });

      console.log(response, "response reverify");

      if (response) {
        const emailID = response.email;
        // await produce("verification-request", { emailID, status });
        await instructorController.updateVerifyStatus({emailID,status})

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
      console.log(requestData, "getRequestData");
      if (requestData) {
        res.status(200).json({
          data: requestData,
        });
      } else {
        res.json(requestData);
      }
    } catch (error) {
      console.log(error);

      throw new Error("Error ");
    }
  }
  async getAllRequests(req: Request, res: Response): Promise<void> {
    try {
      const requestData = await this.verificationService.getAllRequests();
      console.log(requestData, "getAllRequests");
      if (requestData) {
        res.status(200).json(requestData);
      } else {
        res.json(requestData);
      }
    } catch (error) {
      console.log(error);

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
      console.log(approvedRequest,"approvedreq")
      if (approvedRequest) {
        // produce("approve-reject-request", {
        //   emailID: email,
        //   status: approvedRequest.status,
        // });
        await instructorController.approveRequest({emailID: email,
          status: approvedRequest.status,})
        console.log("kafka-produces");
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
      console.log(error);

      throw new Error("Error in controller ");
    }
  }
}
