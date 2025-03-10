import { IAdmin } from "../../models/adminModel";
import { adminWallet } from "../../Types/types";
import { Request, Response } from "express";

export interface IAdminControllers {
  updateWallet(data: adminWallet): Promise<IAdmin | null>;
  createAdmin(data: IAdmin): Promise<void>;
  getAdminDetails(req: Request, res: Response): Promise<void>;
}
