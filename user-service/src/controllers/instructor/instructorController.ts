import { NextFunction, Request, Response } from "express";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import bcrypt from "bcrypt";
import verifyToken from "../../utils/jwt";
import produce from "../../config/kafka/producer";

import { IInstructorControllers } from "../interfaces/IInstructorController";
import { IInstructorService } from "../../services/interfaces/IInstructorService";
import { IInstructor } from "../../models/instructorModel";
import {
  InstructorUpdateStatus,
  InstructorWallet,
  ResetPassword,
} from "../../types/types";

export class InstructorController implements IInstructorControllers {
  private instructorService: IInstructorService;
  constructor(instructorService: IInstructorService) {
    this.instructorService = instructorService;
  }

  public async addInstructor(payload: IInstructor): Promise<void> {
    try {
      let response = await this.instructorService.createInstructor(payload);
    } catch (error) {
      throw error;
    }
  }
  public async getInstructor(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.params;
      let response = await this.instructorService.getInstructorData(email);
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
  async getMentorExpertise(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const expertise = await this.instructorService.getMentorExpertise();

      res.status(200).json({
        success: true,
        data: expertise,
      });
    } catch (error) {
      next(error);
    }
  }
  async getPaginatedMentors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const search = (req.query.search as string) || "";
      const sort = (req.query.sort as string) || "verified";

      let expertise: string[] = [];

      if (req.query.expertise) {
        expertise = Array.isArray(req.query.expertise)
          ? (req.query.expertise as string[])
          : [req.query.expertise as string];
      }

      const result = await this.instructorService.getPaginatedMentors(
        page,
        limit,
        search,
        sort,
        expertise
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getInstructorById(req: Request, res: Response): Promise<void> {
    try {
      const { instructorId } = req.params;
      let response = await this.instructorService.getInstructorDataById(
        instructorId
      );
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const { _id, username, mobile, expertise, skills } = req.body;

      let profilePicUrl = "No Picture";
      let response;

      if (req.file) {
        profilePicUrl = await uploadToS3Bucket(req.file, "Instructors");

        response = await this.instructorService.updateProfile(_id, {
          username,
          mobile,
          profilePicUrl,
        });
      } else {
        response = await this.instructorService.updateProfile(_id, {
          username,
          mobile,
          expertise,
          skills,
        });
      }

      if (response) {
        await produce("update-profile-instructor", response);
        res.status(200).json({
          success: true,
          message: "Profile Updated!",
          user: response,
        });
      } else {
        res.json({
          success: false,
          message: "Not Updated!",
        });
      }
    } catch (error) {
      throw error;
    }
  }
  public async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "", email } = req.query;

      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email is required",
        });
        return;
      }

      const result = await this.instructorService.getTransactionsList(
        String(email),
        Number(page),
        Number(limit),
        String(search)
      );

      if (!result) {
        res.status(404).json({
          success: false,
          message: "No transactions found or instructor doesn't exist",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Fetched transactions data successfully",
        data: {
          data: result.transactions,
          total: result.total,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching transactions",
        error: error.message,
      });
    }
  }
  async updatePlanPrice(req: Request, res: Response): Promise<void> {
    try {
      const { planPrice } = req.body;
      const { instructorId } = req.params;
      const response = await this.instructorService.updatePlanPrice(
        instructorId,
        planPrice
      );
      if (!response) {
        res.status(500).json({
          success: false,
          message: "Something error! Couldn't fetch data!",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Updated PlanPrice!",

        data: response,
      });
    } catch (error) {
      throw error;
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<any> {
    try {
      const { currentPassword, newPassword } = req.body;
      const tokenData = await verifyToken(req.cookies["accessToken"]);
      if (!tokenData) {
        throw new Error("Token expiered!");
      }
      let email = tokenData.email;
      const response = await this.instructorService.getInstructorData(email);
      if (!response) {
        throw new Error("No user Found");
      }

      const oldPassword = response?.password;

      const result = await bcrypt.compare(currentPassword, oldPassword);
      if (result) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await this.instructorService.updatePassword(
          email,
          hashedPassword
        );
        if (response) {
          await produce("update-password-instructor", {
            email,
            password: hashedPassword,
          });
          res.status(200).json({
            success: true,
            message: "Password Updated",
          });
        } else {
          res.json({
            success: false,
            message: "Password Not Updated",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Current Password is Wrong",
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async getInstructors(req: Request, res: Response) {
    try {
      const Instructors = await this.instructorService.getInstructors();
      res.status(200).json({
        users: Instructors,
      });
    } catch (error) {
      throw error;
    }
  }
  public async blockInstructor(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const InstructorData = await this.instructorService.getInstructorData(
        email
      );

      if (!InstructorData) {
        throw new Error("No user found");
      }
      let id = InstructorData?._id?.toString();

      if (!id) {
        throw new Error("Instructor ID is missing");
      }
      const isBlocked = !InstructorData?.isBlocked;

      const InstructorStatus = await this.instructorService.updateProfile(id, {
        isBlocked,
      });
      await produce("block-instructor", { email, isBlocked });

      if (InstructorStatus?.isBlocked) {
        res.status(200).json({
          success: true,
          message: "Instructor Blocked",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Instructor UnBlocked",
        });
      }
    } catch (error) {
      throw error;
    }
  }

  ///kafka consume
  async passwordReset(data: ResetPassword): Promise<IInstructor | null> {
    try {
      const { password, email } = data;
      const response = await this.instructorService.updatePassword(
        email,
        password
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateVerifyStatus(
    data: InstructorUpdateStatus
  ): Promise<IInstructor | null> {
    try {
      let email = data.emailID;
      let status = data.status;

      const instructorData = await this.instructorService.getInstructorData(
        email
      );
      let response;
      let id = instructorData?._id?.toString();

      if (!id) {
        throw new Error("Instructor ID is missing");
      }

      if (status === "approved") {
        const isVerified = true;
        response = await this.instructorService.updateProfile(id, {
          verificationStatus: status,
          isVerified,
        });
      } else {
        response = await this.instructorService.updateProfile(id, {
          verificationStatus: status,
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async approveRequest(data: {
    emailID: string;
    status: string;
  }): Promise<IInstructor | null> {
    try {
      let email = data.emailID;
      let status = data.status;

      const instructorData = await this.instructorService.getInstructorData(
        email
      );
      let response;
      let id = instructorData?._id?.toString();

      if (!id) {
        throw new Error("Instructor ID is missing");
      }
      if (status === "approved") {
        const isVerified = true;
        response = await this.instructorService.updateProfile(id, {
          verificationStatus: status,
          isVerified,
        });
      } else if (status === "rejected") {
        const isVerified = false;

        response = await this.instructorService.updateProfile(id, {
          verificationStatus: status,
          isVerified,
        });
      } else {
        response = await this.instructorService.updateProfile(id, {
          verificationStatus: status,
        });
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateWallet(data: InstructorWallet): Promise<IInstructor | null> {
    try {
      const { txnid, amount, description, type, instructorId } = data;
      const instructorDetails =
        await this.instructorService.getInstructorDataById(instructorId);
      if (!instructorDetails) {
        throw new Error("No instructor details not found");
      }
      const transactions = instructorDetails?.wallet.transactions ?? [];
      let walletDetails;
      if (type === "debit") {
        walletDetails = {
          balance: Number(instructorDetails?.wallet.balance) - Number(amount),
          transactions: [...transactions, { amount, description, txnid, type }],
        };
      } else {
        walletDetails = {
          balance: Number(instructorDetails?.wallet.balance) + Number(amount),
          transactions: [...transactions, { amount, description, txnid, type }],
        };
      }
      const response = await this.instructorService.updateProfile(
        instructorId,
        { wallet: walletDetails }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
