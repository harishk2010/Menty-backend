import { JwtService } from "../utils/jwt";
import { Request, Response } from "express";
import { IAdminControllers } from "./interfaces/IAdminControllers";
import IAdminService from "../services/interfaces/IAdminService";
import { config } from "dotenv";
import produce from "../config/kafka/producer";
config();

export class AdminController implements IAdminControllers {
  private adminService: IAdminService;
  private JWT: JwtService;
  constructor(adminService: IAdminService) {
    this.JWT = new JwtService();
    this.adminService = adminService;
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin@123";

      // Check credentials in one conditional block
      if (email !== adminEmail || password !== adminPassword) {
        res.status(401).send({
          success: false,
          message: email !== adminEmail ? "Email Wrong" : "Password Wrong",
        });
        return;
      }

      let admin;
      try {
        admin = await this.adminService.getAdminData(email);
        if (!admin) {
          admin = await this.adminService.createAdmin(email, password);
          admin && produce("create-admin-data", admin);
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).send({
          success: false,
          message: "Error processing admin data",
        });
        return;
      }

      const accessToken = await this.JWT.accessToken({
        email,
        role: "admin",
        id: admin?._id,
      });

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(200)
        .send({
          success: true,
          message: "Welcome Admin",
          data: {
            email,
            role: "admin",
            name: "admin",
            adminId: admin?._id,
          },
        });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).send({ success: true, message: "logout success" });
    } catch (error: any) {
      throw error;
    }
  }
}
