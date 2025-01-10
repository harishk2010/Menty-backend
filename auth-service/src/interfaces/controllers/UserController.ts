import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/UseCases/RegisterUserUseCase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { HashService } from "../../infrastructure/services/HashService";
import { NextFunction } from "http-proxy-middleware/dist/types";

const userRepository = new UserRepositoryImpl();
const hashService = new HashService();
const registerUserUseCase = new RegisterUserUseCase(userRepository, hashService);

export class UserController {

    constructor(
        private registerUserUseCase : RegisterUserUseCase
    ){

    }
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email, password } = req.body;
        const user = await registerUserUseCase.execute({ email, password });
    
        res.status(201).json({
          success: true,
          message: "User registered successfully",
          data: user,
        });
      } catch (error: any) {
        console.error("Error caught in controller:", error.message); // Debug log
        res.status(400).json({
          success: false,
          message: error.message || "An error occurred",
        });
      }
    }
    
}
