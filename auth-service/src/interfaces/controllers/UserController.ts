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
        private userUseCase : RegisterUserUseCase
    ){

    }
  async register(req: Request, res: Response, next : NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const user = await registerUserUseCase.execute({name, email, password});
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
