import { Request, Response } from "express";
import { IAdminControllers } from "../interfaces/IAdminControllers";
import IAdminService from "../../services/interfaces/IAdminService";
import { config } from "dotenv";
import { adminWallet } from "../../Types/types";
import { IAdmin } from "../../models/adminModel";
import { AdminErrorMsg, AdminSuccessMsg } from "../../utils/constants";
import { StatusCode, TransactionType } from "../../utils/enums";
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
      console.log(adminDetails,"adminDetails")
      if (!adminDetails) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: AdminErrorMsg.NO_ADMIN_DATA,
        });
        return;
      } else {
        res.status(StatusCode.OK).json({
          success: true,
          message: AdminSuccessMsg.ADMIN_DATA_FOUND,
          data: adminDetails,
        });
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateWallet(data: adminWallet): Promise<IAdmin | null> {
    try {
      const { txnid, amount, description, type } = data;

      const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
      const adminDetails = await this.adminService.getAdminData(String(email));

      if (!adminDetails) {
        throw new Error(AdminErrorMsg.NO_ADMIN_DATA);
      }
      const transactions = adminDetails?.wallet.transactions ?? [];
      let walletDetails;
      if (type ===TransactionType.DEBITED) {
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
