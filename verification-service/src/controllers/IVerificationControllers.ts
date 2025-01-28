
import { Request, Response } from "express";

export interface IVerificationControllers {
  submitRequest(req: Request, res: Response): Promise<void>;
}
