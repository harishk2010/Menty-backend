import { NextFunction, Request, Response } from "express";

export interface IAdminDashboardController {
  getDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
