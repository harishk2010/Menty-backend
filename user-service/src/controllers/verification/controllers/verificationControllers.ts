import { Request, Response } from "express";
import { IVerificationControllers } from "../../interfaces/IVerificationControllers";
import { uploadToS3Bucket } from "../../../utils/s3Bucket";
import { IVerificationService } from "../../../services/interfaces/IVerificationService";
import produce from "../../../config/kafka/producer";
import { instructorController } from "../../../config/dependencyInjector";
import { VerificationErrorMessages, VerificationSuccessMessages } from "@/utils/constants";
import { StatusCode, VerifiedStatus } from "@/utils/enums";

export class VerificationContoller implements IVerificationControllers {
  private verificationService: IVerificationService;

  constructor(verificationService: IVerificationService) {
    this.verificationService = verificationService;
  }

  async submitRequest(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;
      if (!req.files || typeof req.files !== "object") {
        throw new Error(VerificationErrorMessages.DOCUMENTS_MISSING);
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

        res.status(StatusCode.OK).send({
          success: true,
          message: VerificationSuccessMessages.VERIFICATION_REQUEST_SENT,
          data: response,
        });
      } else {
        res.status(StatusCode.BAD_REQUEST).send({
          success: false,
          message: VerificationErrorMessages.NO_DOCUMENTS_RECEIVED,
        });
      }
    } catch (error) {
      throw error
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

      const status = VerifiedStatus.PENDING;

      const response = await this.verificationService.updateRequest(email, {
        username,
        degreeCertificateUrl,
        resumeUrl,
        status,
      });

      if (response) {
        const emailID = response.email;
        await instructorController.updateVerifyStatus({ emailID, status });

        res.status(StatusCode.OK).send({
          success: true,
          message: VerificationSuccessMessages.REVERIFICATION_REQUEST_SENT,
          data: response,
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
          success: false,
          message: VerificationErrorMessages.REVERIFICATION_REQUEST_FAILED,
        });
      }
    } catch (error) {
     
      throw error
    }
  }

  async getRequestData(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const requestData = await this.verificationService.getRequestData(email);
      if (requestData) {
        res.status(StatusCode.OK).json({
          data: requestData,
        });
      } else {
        res.json(requestData);
      }
    } catch (error) {
      throw error
    }
  }
  async getAllRequests(req: Request, res: Response): Promise<void> {
    try {
      const requestData = await this.verificationService.getAllRequests();
      if (requestData) {
        res.status(StatusCode.OK).json(requestData);
      } else {
        res.json(requestData);
      }
    } catch (error) {
      throw error
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
        if (approvedRequest.status == VerifiedStatus.APPROVED) {
          let email = approvedRequest.email;
          let username = approvedRequest.username;

          produce("verified-Instructor-email", { email, username });

          res.status(StatusCode.OK).json({
            success: true,
            message: VerificationSuccessMessages.INSTRUCTOR_VERIFIED,
            data: approvedRequest,
          });
        } else if (approvedRequest.status === VerifiedStatus.REJECTED) {
          res.status(StatusCode.OK).json({
            success: true,
            message: VerificationSuccessMessages.REQUEST_REJECTED,
            data: approvedRequest,
          });
        }
      } else {
        res.json(approvedRequest);
      }
    } catch (error) {
      throw error
    }
  }
}
