import { JwtService } from "../utils/jwt";
import { Request, Response } from "express";
import { IAdminControllers } from "./interfaces/IAdminControllers";
import IAdminService from "../services/interfaces/IAdminService";
import { config } from "dotenv";
import produce from "../config/kafka/producer";
import { AdminErrorMessages, AdminSuccessMessages, GeneralServerErrorMsg, MongoDB } from "../utils/constants";
import { Roles, StatusCode } from "../utils/enums";
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
       
        res.send({
          success: false,
          message: email !== adminEmail ? AdminErrorMessages.EMAIL_INCORRECT :AdminErrorMessages.PASSWORD_INCORRECT,
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
        console.error(MongoDB.ERROR, dbError);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
          success: false,
          message: AdminErrorMessages.ADMIN_DATA_ERROR,
        });
        return;
      }

      const accessToken = await this.JWT.accessToken({
        email,
        role: Roles.ADMIN,
        id: admin?._id,
      });

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(StatusCode.OK)
        .send({
          success: true,
          message: AdminSuccessMessages.LOGIN_SUCCESS,
          data: {
            email,
            role: Roles.ADMIN,
            name: Roles.ADMIN,
            adminId: admin?._id,
          },
        });
    } catch (error) {
      console.error("Login error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: GeneralServerErrorMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(StatusCode.OK).send({ success: true, message: AdminSuccessMessages.LOGOUT_SUCCESS });
    } catch (error: any) {
      throw error;
    }
  }
}
