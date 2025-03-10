import { Request, Response } from "express";
import { IAdminControllers } from "../interfaces/IAdminControllers";
import IAdminService from "../../services/interfaces/IAdminService";
import { config } from "dotenv";
import { adminWallet } from "../../Types/types";
import { IAdmin } from "../../models/adminModel";
config();

export class AdminController implements IAdminControllers {
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  async getAdminDetails(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const adminDetails = await this.adminService.getAdminData(email);
      if (!adminDetails) {
        res.status(500).json({
          success: false,
          message: "No adminData Found!",
        });
        return;
      } else {
        res.status(200).json({
          success: true,
          message: "No adminData Found!",
          data: adminDetails,
        });
        return;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateWallet(data: adminWallet): Promise<IAdmin | null> {
    try {
      const { txnid, amount, description, type } = data;

      const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
      const adminDetails = await this.adminService.getAdminData(String(email));

      if (!adminDetails) {
        throw new Error("No admin details not found");
      }
      const transactions = adminDetails?.wallet.transactions ?? [];
      let walletDetails;
      if (type === "debit") {
        walletDetails = {
          balance: Number(adminDetails?.wallet.balance) - Number(amount),
          transactions: [...transactions, { amount, description, txnid, type }],
        };
      } else {
        walletDetails = {
          balance: Number(adminDetails?.wallet.balance) + Number(amount),
          transactions: [...transactions, { amount, description, txnid, type }],
        };
      }

      const response = await this.adminService.updateProfile(
        adminDetails.email,
        { wallet: walletDetails }
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(data: IAdmin): Promise<void> {
    try {
      const { email, password } = data;
      const admin = this.adminService.createAdmin(email, password);
    } catch (error) {
      throw error;
    }
  }
}
