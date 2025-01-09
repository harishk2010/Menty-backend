import express, { Request, Response, NextFunction, Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { RegisterUserUseCase } from "../../application/UseCases/RegisterUserUseCase";

import { HashService } from "../../infrastructure/services/HashService";


const userRepository = new UserRepositoryImpl()
const hashService = new HashService()
const userUseCase = new RegisterUserUseCase(userRepository, hashService);
const userController = new UserController(userUseCase)

const router = express.Router();


export function userRoute(): Router {

    const router = express.Router();
    router.post('/register', (req: Request, res: Response, next: NextFunction) => {
        userController.register(req, res, next);
    });
    return router;
}

export default userRoute;
